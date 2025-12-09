<script lang="ts">
    import '../app.css';
    import Nav from '$lib/components/Nav.svelte';
    let { children } = $props();
</script>

<div class="app">
    <Nav />
    <main class="content">
        {@render children()}
    </main>
</div>

<style>
    :root {
        --primary: #3b82f6;
        --success: #06b6d4;
        --surface: #ffffff;
        --background: #f9fafb;
        --text: #111827;
        --muted: #64748b;
        --error: #EF4444;
    }
    .app {
        min-height: 100vh;
        display: grid;
        grid-template-rows: auto 1fr;
        background: var(--background);
        color: var(--text);
    }
    .content {
        display: block;
        width: 100%;
        max-width: 1100px;
        margin: 0 auto;
        padding: 1rem;
        box-sizing: border-box;
    }
</style>
