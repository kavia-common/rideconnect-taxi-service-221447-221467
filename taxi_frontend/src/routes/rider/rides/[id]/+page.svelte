<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { auth } from '$lib/stores/auth';
    import { api } from '$lib/api/client';
    import Map from '$lib/map/Map.svelte';
    import { connectRideSocket, type RideSocket } from '$lib/realtime/socket';

    type Ride = {
        id: string;
        status: string;
        origin?: string;
        destination?: string;
        positions?: Array<{ lat: number; lng: number }>;
    };

    let id = $state('');
    let ride = $state<Ride | null>(null);
    let positions = $state<Array<{ lat: number; lng: number }>>([]);
    let error = $state<string | null>(null);
    let socket: RideSocket | null = null;

    $effect.pre(() => {
        id = $page.params.id;
    });

    async function load() {
        const a = $state.snapshot(auth);
        const token = a.token ?? undefined;
        const res = await api.getRide(id, token);
        if (res.ok) {
            ride = res.data;
            positions = res.data.positions || [];
        } else {
            error = res.error;
        }
    }

    onMount(async () => {
        await load();
        socket = connectRideSocket(id, (evt) => {
            if (evt.type === 'position') {
                positions = [...positions, evt.payload];
            } else if (evt.type === 'status') {
                if (ride) ride.status = evt.payload.status;
            }
        });
    });

    $effect(() => () => {
        if (socket) socket.disconnect();
    });
</script>

<section class="grid">
    <div class="card">
        <h2>Ride #{id}</h2>
        {#if error}<p class="error">{error}</p>{/if}
        {#if ride}
            <p class="muted">Status: <strong class="status">{ride.status}</strong></p>
            <p class="muted">{ride.origin} → {ride.destination}</p>
        {/if}
    </div>
    <div class="card">
        <h3>Live Location</h3>
        <Map {positions} />
    </div>
    <div class="card">
        <h3>Live Updates</h3>
        <div class="log">
            {#if positions.length === 0}
              <p class="muted">Waiting for driver updates...</p>
            {:else}
              {#each positions as p, i (i)}
                <div>#{i + 1}: {p.lat.toFixed(5)}, {p.lng.toFixed(5)}</div>
              {/each}
            {/if}
        </div>
    </div>
</section>

<style>
.grid { display: grid; gap: 1rem; }
.card {
    background: var(--surface);
    border: 1px solid #e5e7eb;
    border-radius: .75rem;
    padding: 1rem;
}
.muted { color: var(--muted); }
.status { color: var(--primary); text-transform: capitalize; }
.error { color: var(--error); }
.log { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: .9rem; display: grid; gap: .25rem; }
</style>
