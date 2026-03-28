import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [{
  label: 'Home',
  icon: 'i-lucide-home',
  to: '/'
}, {
  label: 'Music',
  icon: 'i-lucide-music',
  to: '/music'
}, {
  label: 'Blog',
  icon: 'i-lucide-file-text',
  to: '/blog'
}, {
  label: 'YouTube',
  icon: 'i-lucide-youtube',
  to: '/youtube'
}, {
  label: 'Contacto',
  icon: 'i-lucide-mail',
  to: '/contact'
}]
