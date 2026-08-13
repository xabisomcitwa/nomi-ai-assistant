# nomi-ai-assistant

Build a beautiful, modern, and emotionally intelligent AI productivity platform called “Nexus Flow” — a single, cohesive dashboard that feels like a calm co-pilot for knowledge workers.

Nexus Flow is not just another AI tool collection. It is a unified workplace operating system that helps professionals reclaim focus, reduce cognitive load, and move through their day with clarity and intention.

Core Concept:
“One calm dashboard. Multiple AI superpowers. Zero friction.”

Required Features (must all live inside one seamless application):

1. Smart Email Composer
   - Generate professional emails in Formal, Friendly, Persuasive, or Empathetic tones
   - Allow users to paste context or key points
   - One-click rewrite + tone switcher
   - Editable output with “Copy” and “Regenerate” actions

2. Meeting Alchemy (Notes Summarizer)
   - Paste long meeting notes or transcript
   - AI extracts: Key Decisions, Action Items (with owners + deadlines), Open Questions, and a crisp executive summary
   - Beautiful structured output cards

3. Flow Planner (AI Task Scheduler)
   - Input tasks + energy levels + priorities
   - Generates optimized daily or weekly schedules
   - Smart prioritization (Impact × Urgency × Energy)
   - Drag-and-drop style task cards with time blocks

4. Insight Engine (Research Assistant)
   - Users paste an article, topic, or research question
   - AI returns: Concise summary, Key insights, Strategic recommendations, and Potential risks/opportunities

5. Pulse — Workplace AI Chat Companion
   - Persistent, elegant chatbot that feels like a thoughtful colleague
   - Can answer workplace questions, help refine prompts, or assist across the other tools
   - Clean message bubbles with subtle typing indicators

Design & UX Requirements:
- Clean, premium SaaS aesthetic (think Linear + Notion + Arc)
- Soft neutral background with subtle gradient accents (deep indigo + soft teal)
- Glassmorphism cards with soft shadows
- Collapsible left sidebar with icons + labels for each tool
- Top bar with “Nexus Flow” logo, user avatar placeholder, and a subtle “AI is assisting” indicator
- Fully responsive (desktop-first, but excellent on mobile)
- Every AI output must be editable and have clear “Copy” + “Regenerate” buttons
- Smooth micro-interactions and generous whitespace
- Professional typography (Inter or similar)

Important Guardrails:
- Include a clear Responsible AI disclaimer at the bottom of the dashboard and inside each tool
- Never claim the AI is 100% accurate — always frame outputs as “suggestions”
- Use structured, high-quality system prompts under the hood for each feature
- Keep the entire experience feeling calm, focused, and human — not chaotic or overwhelming

Overall Vibe:
A sophisticated yet warm productivity sanctuary. The kind of tool that makes professionals feel lighter and more in control the moment they open it.

Start by building the full dashboard shell with sidebar navigation and then implement the five AI tools one by one.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://nomi-desk.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3b5cc7e6-0d9f-47fe-bb21-f210011328d1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
