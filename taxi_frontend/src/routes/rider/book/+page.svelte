<script lang="ts">
    import { api } from '$lib/api/client';
    import { auth } from '$lib/stores/auth';
    import { goto } from '$app/navigation';

    let origin = $state('');
    let destination = $state('');
    let loading = $state(false);
    let error = $state<string | null>(null);

    async function submit() {
        loading = true; error = null;
        const a = $state.snapshot(auth);
        const token = a.token ?? undefined;
        const res = await api.createRide({ origin, destination }, token);
        loading = false;
        if (res.ok) {
            goto(`/rider/rides/${res.data.id}`);
        } else {
            error = res.error;
        }
    }
</script>

<section class="card">
    <h2>Book a Ride</h2>
    {#if error}<p class="error">{error}</p>{/if}
    <form onsubmit|preventDefault={submit}>
        <label>Pickup location <input type="text" bind:value={origin} required placeholder="e.g., 123 Main St" /></label>
        <label>Dropoff location <input type="text" bind:value={destination} required placeholder="e.g., Airport" /></label>
        <button class="btn" disabled={loading || !origin || !destination}>{loading ? 'Booking...' : 'Confirm Booking'}</button>
    </form>
</section>

<style>
.card {
    background: var(--surface);
    border: 1px solid #e5e7eb;
    padding: 1.25rem;
    border-radius: .75rem;
    max-width: 640px;
    margin: 1rem auto;
}
label { display: grid; gap: .25rem; margin-bottom: .75rem; }
input {
    padding: .6rem .75rem; border-radius: .5rem; border: 1px solid #e5e7eb;
    background: white; color: var(--text);
}
.btn {
    padding: .6rem .9rem; border-radius: .5rem; border: 1px solid transparent; background: var(--primary); color: white; cursor: pointer;
}
.error { color: var(--error); }
</style>
