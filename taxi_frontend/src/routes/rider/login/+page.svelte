<script lang="ts">
    import { api } from '$lib/api/client';
    import { auth } from '$lib/stores/auth';
    import { goto } from '$app/navigation';

    let email = '';
    let password = '';
    let loading = false;
    let error: string | null = null;

    async function login() {
        loading = true; error = null;
        const res = await api.riderLogin({ email, password });
        loading = false;
        if (res.ok) {
            auth.set({ token: res.data.token, user: res.data.user });
            goto('/rider/dashboard');
        } else {
            error = res.error;
        }
    }
</script>

<section class="card">
    <h2>Rider Login</h2>
    {#if error}<p class="error">{error}</p>{/if}
    <form on:submit|preventDefault={login}>
        <label>Email <input type="email" bind:value={email} required /></label>
        <label>Password <input type="password" bind:value={password} required /></label>
        <button class="btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
    </form>
    <p class="muted">No account? <a href="/rider/register">Register</a></p>
</section>

<style>
.card {
    background: var(--surface);
    border: 1px solid #e5e7eb;
    padding: 1.25rem;
    border-radius: .75rem;
    max-width: 480px;
    margin: 2rem auto;
}
h2 { margin: 0 0 1rem; }
label { display: grid; gap: .25rem; margin-bottom: .75rem; }
input {
    padding: .6rem .75rem; border-radius: .5rem; border: 1px solid #e5e7eb;
    background: white; color: var(--text);
}
.btn {
    padding: .6rem .9rem; border-radius: .5rem; border: 1px solid transparent; background: var(--primary); color: white; cursor: pointer;
}
.muted { color: var(--muted); }
.error { color: var(--error); }
</style>
