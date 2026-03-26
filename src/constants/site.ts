import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { owner as ghOwner, repo } from './config/github'

export const title = 'AgentFend - Changelog'
export const description =
  'Security research, threat intelligence, and AI skill auditing — by the AgentFend team.'
export const owner = 'AgentFend'

export const baseOptions: BaseLayoutProps = {
  nav: {
    title,
  },
  githubUrl: `https://github.com/${ghOwner}/${repo}`,
}
