import { Icons } from '@/components/icons/icons'
import type { Social } from '@/types'

export const socials: Social[] = [
  {
    icon: <Icons.gitHub />,
    name: 'GitHub',
    url: 'https://github.com/agentfend',
    description: 'Open-source tools & research',
  },
  {
    icon: <Icons.globe />,
    name: 'Website',
    url: 'https://agentfend.com',
    description: 'AgentFend website',
  },
  {
    icon: <Icons.twitter />,
    name: 'X (Twitter)',
    url: 'https://x.com/agentfend',
    description: 'Threat alerts & updates',
  },
  {
    icon: <Icons.mail />,
    name: 'Contact',
    url: 'mailto:contact@agentfend.com',
    description: 'Report a vulnerability',
  },
]
