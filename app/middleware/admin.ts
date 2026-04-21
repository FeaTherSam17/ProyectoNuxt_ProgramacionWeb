export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') {
    return
  }

  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  const { data } = await useFetch('/api/auth/session', {
    key: `admin-session-${to.path}`,
    headers
  })

  if (!data.value?.ok) {
    return navigateTo('/admin/login')
  }
})
