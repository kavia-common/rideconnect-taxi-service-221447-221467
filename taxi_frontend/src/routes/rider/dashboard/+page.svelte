<script lang="ts">
    import { onMount } from 'svelte';
    import { auth } from '$lib/stores/auth';
    import { api } from '$lib/api/client';
    import { goto } from '$app/navigation';

    type Ride = { id: string; status: string; origin?: string; destination?: string };

    let rides = $state<Ride[]>([]);
    let loading = $state(false);
    let error = $state<string | null>(null);

    function book() {
        goto('/rider/book');
    }

    async function load() {
        loading = true; error = null;
        const a = $state.snapshot(auth);
        const token = a.token ?? undefined;
        const res = await api.getRiderRides(token);
        loading = false;
        if (res.ok) rides = res.data;
        else error = res.error;
    }

    onMount(load);
</script>

<section class="grid">
    <div class="card header">
        <div class="title">
            <h2>Rider Dashboard</h2>
            <p class="muted">Manage your bookings</p>
        </div>
        <button class="btn success" onclick={book}>Book a Ride</button>
    </div>

    <div class="card">
        <h3>Your Rides</h3>
        {#if loading}<p>Loading rides...</p>
        {:else if error}<p class="error">{error}</p>
        {:else if rides.length === 0}<p class="muted">No rides yet</p>
        {:else}
            <ul class="list">
                {#each rides as r (r.id)}
                <li>
                    <button type="button" class="item" onclick={() => goto(`/rider/rides/${r.id}`)}>
                        <div>
                            <div class="strong">#{r.id}</div>
                            <div class="muted small">{r.origin} → {r.destination}</div>
                        </div>
                        <div class="status">{r.status}</div>
                    </button>
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
.header {
    display: flex; align-items: center; justify-content: space-between;
}
.title h2 { margin: 0; }
.muted { color: var(--muted); }
.small { font-size: .9rem; }
.btn { padding: .6rem .9rem; border-radius: .5rem; background: var(--success); color: #053b45; border: 1px solid transparent; cursor: pointer; font-weight: 700; }
.list { list-style: none; padding: 0; margin: .5rem 0 0; }
li { list-style: none; }
.item { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: .75rem; border-radius: .5rem; cursor: pointer; border: none; background: transparent; text-align: left; }
.item:hover { background: #f3f4f6; }
.strong { font-weight: 700; }
.status { text-transform: capitalize; color: var(--primary); font-weight: 700; }
.error { color: var(--error); }
</style>
