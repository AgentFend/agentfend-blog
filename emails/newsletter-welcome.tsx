import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { baseUrl } from '@/constants'

interface NewsletterWelcomeEmailProps {
  firstName: string
  posts: {
    title: string
    description?: string
    date: Date
    tags?: string[]
    image?: string
    author: string
    url: string
  }[]
}

function PostCard({
  title,
  description,
  image,
  url,
}: NewsletterWelcomeEmailProps['posts'][0]) {
  return (
    <Section className='my-[16px]'>
      {image && (
        <Link href={url}>
          <Img
            alt='Post image'
            className='w-full rounded-[12px] object-cover'
            height='240'
            src={image}
          />
        </Link>
      )}
      <Section className='mt-[16px]'>
        <Link
          className='m-0 mt-[8px] font-semibold text-[22px] text-zinc-900 leading-[28px]'
          href={url}
        >
          {title}
        </Link>
        <Text className='text-[15px] text-zinc-500 leading-[24px]'>
          {description || 'Read the full article on the AgentFend Changelog.'}
        </Text>
      </Section>
    </Section>
  )
}

export default function NewsletterWelcomeEmail({
  firstName,
  posts,
}: NewsletterWelcomeEmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fallbackFontFamily='Helvetica'
          fontFamily='Bricolage Grotesque'
          fontStyle='normal'
          fontWeight={400}
          webFont={{
            url: 'https://fonts.gstatic.com/s/bricolagegrotesque/v8/3y9K6as8bTXq_nANBjzKo3IeZx8z6up5BeSl9D4dj_x9PpZBMlGIInHWVyNJ.woff2',
            format: 'woff2',
          }}
        />
      </Head>
      <Preview>
        Welcome to AgentFend – Your AI Agent Security Starts Here 🛡️
      </Preview>
      <Tailwind>
        <Body className='bg-[#0a0a0a] font-sans'>
          <Container className='mx-auto w-full max-w-[600px] p-8'>

            {/* Header */}
            <Section className='mb-8 text-center'>
              <Link href='https://agentfend.com'>
                <Text className='m-0 font-bold text-[22px] text-white tracking-tight'>
                  AgentFend
                </Text>
              </Link>
              <Text className='m-0 text-[12px] text-zinc-500 uppercase tracking-widest'>
                Powered by Onyx Intelligence
              </Text>
            </Section>

            <Hr className='border-zinc-800 my-6' />

            {/* Main content */}
            <Section>
              <Heading className='my-4 font-bold text-[32px] text-white leading-tight'>
                Welcome to AgentFend 🛡️
              </Heading>
              <Text className='text-[16px] text-zinc-300 leading-[28px]'>
                Hi {firstName},
              </Text>
              <Text className='text-[16px] text-zinc-300 leading-[28px]'>
                Thanks for joining AgentFend.
              </Text>
              <Text className='text-[16px] text-zinc-300 leading-[28px]'>
                You are now part of a community of developers and AI power-users
                who don&apos;t leave security to chance. In an era where AI
                agents are becoming ubiquitous, installing a &quot;Skill&quot;
                or script without verification is a major risk to your data.
              </Text>
              <Text className='text-[16px] text-zinc-300 leading-[28px]'>
                <strong className='text-white'>Our mission is simple:</strong>{' '}
                to provide total confidence in your AI tools.
              </Text>
              <Text className='text-[16px] text-zinc-300 leading-[28px]'>
                Powered by our{' '}
                <strong className='text-white'>Onyx Engine</strong>, we audit
                your prompts and scripts to detect malicious behavior, prompt
                injections, or data exfiltration attempts before they can cause
                any damage.
              </Text>
            </Section>

            <Hr className='border-zinc-800 my-6' />

            {/* Getting started */}
            <Section>
              <Heading className='my-4 font-semibold text-[22px] text-white leading-tight'>
                How to get started
              </Heading>

              <Section className='my-[12px]'>
                <Text className='m-0 font-semibold text-[15px] text-white'>
                  🔍 Scan your first Skill
                </Text>
                <Text className='mt-1 text-[15px] text-zinc-400 leading-[24px]'>
                  Head over to your dashboard for an instant Security Score on
                  any script or prompt.
                </Text>
                <Button
                  className='rounded-md bg-white px-5 py-3 font-semibold text-[14px] text-black no-underline'
                  href='https://agentfend.com/en/scanner'
                >
                  Scan your first Skill →
                </Button>
              </Section>

              <Section className='my-[20px]'>
                <Text className='m-0 font-semibold text-[15px] text-white'>
                  📖 Check the Documentation
                </Text>
                <Text className='mt-1 text-[15px] text-zinc-400 leading-[24px]'>
                  Learn how Onyx detects risks and how to secure your own
                  agents.{' '}
                  <Link
                    className='text-zinc-300 underline'
                    href='https://docs.agentfend.com'
                  >
                    docs.agentfend.com
                  </Link>
                </Text>
              </Section>

              <Section className='my-[20px]'>
                <Text className='m-0 font-semibold text-[15px] text-white'>
                  📡 Follow the Changelog
                </Text>
                <Text className='mt-1 text-[15px] text-zinc-400 leading-[24px]'>
                  We update our detection engine almost daily. Stay informed
                  about the latest neutralized threats.{' '}
                  <Link
                    className='text-zinc-300 underline'
                    href={`${baseUrl}`}
                  >
                    AgentFend Changelog
                  </Link>
                </Text>
              </Section>
            </Section>

            {/* Latest posts */}
            {posts.length > 0 && (
              <>
                <Hr className='border-zinc-800 my-6' />
                <Section>
                  <Heading className='my-4 font-semibold text-[20px] text-white leading-tight'>
                    Latest from the Changelog
                  </Heading>
                  {posts.slice(0, 3).map((post) => (
                    <PostCard key={post.url} {...post} />
                  ))}
                </Section>
              </>
            )}

            <Hr className='border-zinc-800 my-6' />

            {/* Community links */}
            <Section className='text-center'>
              <Text className='text-[15px] text-zinc-400 leading-[26px]'>
                Join our community and stay ahead of AI threats.
              </Text>
              <Section className='mt-4 flex gap-4 justify-center'>
                <Button
                  className='mr-3 rounded-md border border-[#5865F2] px-5 py-3 font-semibold text-[14px] text-[#5865F2] no-underline'
                  href='https://discord.gg/dqhe8QbkPs'
                >
                  Join Discord
                </Button>
                <Button
                  className='rounded-md border border-zinc-600 px-5 py-3 font-semibold text-[14px] text-zinc-300 no-underline'
                  href='https://agentfend.com'
                >
                  Visit AgentFend.com
                </Button>
              </Section>
            </Section>

            <Hr className='border-zinc-800 my-6' />

            {/* Footer */}
            <Section className='text-center'>
              <Text className='text-[13px] text-zinc-600 leading-[22px]'>
                We&apos;re excited to have you on board to build a safer and
                more reliable AI ecosystem.
              </Text>
              <Text className='text-[14px] text-zinc-400 leading-[22px]'>
                Best,
                <br />
                <strong className='text-zinc-300'>The AgentFend Team</strong>
                <br />
                <span className='text-zinc-600 text-[12px]'>
                  Powered by Onyx Intelligence
                </span>
              </Text>
              <Text className='text-[12px] text-zinc-700 leading-[20px]'>
                <Link className='text-zinc-600' href='https://agentfend.com'>
                  agentfend.com
                </Link>
                {' · '}
                <Link
                  className='text-zinc-600'
                  href='mailto:contact@agentfend.com'
                >
                  contact@agentfend.com
                </Link>
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

NewsletterWelcomeEmail.PreviewProps = {
  firstName: 'Alex',
  posts: [
    {
      title: 'How Onyx Detects Prompt Injection in AI Skills',
      description:
        'A deep-dive into how our Onyx Engine identifies malicious prompt injection patterns in AI agent scripts before they exfiltrate your data.',
      date: new Date('2026-03-20'),
      tags: ['Security', 'Onyx Engine', 'Prompt Injection'],
      image: undefined,
      author: 'AgentFend Team',
      url: 'https://agentfend.com/posts/onyx-prompt-injection',
    },
    {
      title: 'Top 5 AI Skill Threats in 2026',
      description:
        'From obfuscated payloads to silent data exfiltration — the five most dangerous attack vectors we neutralized this quarter.',
      date: new Date('2026-03-15'),
      tags: ['Threat Intelligence', 'AI Skills', 'Security Score'],
      image: undefined,
      author: 'AgentFend Team',
      url: 'https://agentfend.com/posts/top-5-ai-threats-2026',
    },
  ],
} satisfies NewsletterWelcomeEmailProps
