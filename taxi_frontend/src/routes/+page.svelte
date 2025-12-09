<script lang="ts">
    import { goto } from '$app/navigation';
    function go(path: string) { goto(path); }
</script>

<svelte:head>
    <title>RideConnect Taxi</title>
</svelte:head>

<section class="hero">
    <div class="hero-card">
        <h1>RideConnect</h1>
        <p class="subtitle">Fast, reliable rides for everyone</p>
        <div class="actions">
            <button class="btn primary" onclick={() => go('/rider/login')}>I am a Rider</button>
            <button class="btn success" onclick={() => go('/driver/login')}>I am a Driver</button>
        </div>
    </div>
</section>

<style>
.hero {
    display: grid;
    place-items: center;
    padding: 3rem 1rem;
}
.hero-card {
    background: var(--surface);
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 2rem;
    max-width: 720px;
    width: 100%;
    text-align: center;
    box-shadow: 0 10px 25px rgba(0,0,0,0.06);
}
h1 {
    margin: 0 0 .5rem 0;
    font-size: 2rem;
}
.subtitle {
    margin: 0 0 1.5rem;
    color: var(--muted);
}
.actions {
    display: flex;
    gap: .75rem;
    justify-content: center;
    flex-wrap: wrap;
}
.btn {
    padding: .75rem 1.25rem;
    border-radius: .75rem;
    border: 1px solid transparent;
    background: #e5e7eb;
    color: #111827;
    cursor: pointer;
    font-weight: 600;
}
.btn.primary { background: var(--primary); color: white; }
.btn.success { background: var(--success); color: #053b45; }
.btn:hover { filter: brightness(.98); }
</style>
