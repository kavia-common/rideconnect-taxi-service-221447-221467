<script lang="ts">
    import { onMount } from 'svelte';
    import { auth } from '$lib/stores/auth';
    import { api } from '$lib/api/client';

    type AvailableRide = { id: string; origin: string; destination: string; eta: number };

    let online = $state(false);
    let loadingToggle = $state(false);
    let available = $state<AvailableRide[]>([]);
    let loadingList = $state(false);
    let error = $state<string | null>(null);

    async function toggle() {
        loadingToggle = true; error = null;
        const a = $state.snapshot(auth);
        const token = a.token ?? undefined;
        const res = await api.setDriverAvailability(!online, token);
        loadingToggle = false;
        if (res.ok) {
            online = res.data.online;
            if (online) await refresh();
        } else error = res.error;
    }

    async function refresh() {
        loadingList = true; error = null;
        const a = $state.snapshot(auth);
        const token = a.token ?? undefined;
        const res = await api.getAvailableRides(token);
        loadingList = false;
        if (res.ok) available = res.data; else error = res.error;
    }

    async function accept(id: string) {
        const a = $state.snapshot(auth);
        const token = a.token ?? undefined;
        const res = await api.acceptRide(id, token);
        if (!res.ok) {
            error = res.error;
        } else {
            available = available.filter(r => r.id !== id);
        }
    }

    onMount(refresh);
</script>

<section class="grid">
    <div class="card header">
        <div class="title">
            <h2>Driver Dashboard</h2>
            <p class="muted">Go online to receive ride requests</p>
        </div>
        <button class="btn" class:online={online} onclick={toggle} disabled={loadingToggle}>
            {loadingToggle ? 'Updating...' : online ? 'Go Offline' : 'Go Online'}
        </button>
    </div>

    <div class="card">
        <div class="row">
            <h3>Available Rides</h3>
            <button class="small" onclick={refresh} disabled={loadingList}>Refresh</button>
        </div>
        {#if error}<p class="error">{error}</p>{/if}
        {#if loadingList}<p>Loading...</p>
        {:else if available.length === 0}<p class="muted">No rides available</p>
        {:else}
        <ul class="list">
            {#each available as r (r.id)}
            <li>
                <div>
                    <div class="strong">#{r.id}</div>
                    <div class="muted small">{r.origin} → {r.destination}</div>
                </div>
                <div class="actions">
                    <span class="eta">{r.eta} min</span>
                    <button class="btn accept" onclick={() => accept(r.id)}>Accept</button>
                </div>
            </li>
            {/each}
        </ul>
        {/if}
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
.header { display: flex; align-items: center; justify-content: space-between; }
.muted { color: var(--muted); }
.row { display: flex; align-items: center; justify-content: space-between; }
.small { font-size: .85rem; padding: .3rem .5rem; border-radius: .5rem; border: 1px solid #e5e7eb; background: white; cursor: pointer; }
.btn { padding: .6rem .9rem; border-radius: .5rem; border: 1px solid transparent; background: var(--primary); color: white; cursor: pointer; font-weight: 700; }
.btn.online { background: var(--error); }
.list { list-style: none; padding: 0; margin: .5rem 0 0; display: grid; gap: .5rem; }
li { display: flex; align-items: center; justify-content: space-between; padding: .75rem; border-radius: .5rem; background: #f9fafb; }
.strong { font-weight: 700; }
.small { font-size: .9rem; }
.actions { display: flex; align-items: center; gap: .5rem; }
.eta { color: var(--muted); }
.accept { background: var(--success); color: #053b45; }
.error { color: var(--error); }
</style>
