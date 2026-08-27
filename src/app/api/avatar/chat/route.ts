import { NextResponse } from 'next/server';
import { getAvatarResponse } from '@/lib/ai';
import {
  fetchAvatarResponsesFromSupabase,
  fetchProjectsFromSupabase,
  fetchCertificatesFromSupabase,
  getLivePortfolioContextSummary,
} from '@/lib/supabase-avatar';
import { checkRateLimit, sanitizeInput } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // IP Rate Limiting Guard (max 25 AI queries per minute per IP)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous-ip';
    const rateLimit = checkRateLimit(`avatar-chat-${ip}`, 25, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { reply: 'You are asking questions too fast! Please wait a moment before sending another query.', answer: 'You are asking questions too fast! Please wait a moment.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const rawQuestion = body.question || body.message;

    if (!rawQuestion || typeof rawQuestion !== 'string') {
      return NextResponse.json({ error: 'Question string is required' }, { status: 400 });
    }

    const cleanQuestion = sanitizeInput(rawQuestion.trim().toLowerCase(), 500);

    // Fetch projects from Supabase & combine with client payload if Supabase is empty
    let liveProjects = await fetchProjectsFromSupabase();
    if ((!liveProjects || liveProjects.length === 0) && Array.isArray(body.projects) && body.projects.length > 0) {
      liveProjects = body.projects;
    }

    // Fetch certs from Supabase & combine with client payload if Supabase is empty
    let liveCerts = await fetchCertificatesFromSupabase();
    if ((!liveCerts || liveCerts.length === 0) && Array.isArray(body.certificates) && body.certificates.length > 0) {
      liveCerts = body.certificates;
    }

    // 1. Check custom QA entries in Supabase
    const dbResponses = await fetchAvatarResponsesFromSupabase();
    const matchedDb = dbResponses.find(
      (r) =>
        r.question.toLowerCase().includes(cleanQuestion) ||
        cleanQuestion.includes(r.question.toLowerCase())
    );

    if (matchedDb) {
      return NextResponse.json({
        question: rawQuestion.trim(),
        reply: matchedDb.answer,
        answer: matchedDb.answer,
        source: 'supabase_qa',
      });
    }

    // 2. EDUCATION INQUIRY
    if (
      cleanQuestion.includes('education') ||
      cleanQuestion.includes('study') ||
      cleanQuestion.includes('studying') ||
      cleanQuestion.includes('college') ||
      cleanQuestion.includes('university') ||
      cleanQuestion.includes('school') ||
      cleanQuestion.includes('btech') ||
      cleanQuestion.includes('b.tech') ||
      cleanQuestion.includes('degree') ||
      cleanQuestion.includes('diploma') ||
      cleanQuestion.includes('polytechnic')
    ) {
      const eduReply = "Tushar's Educational Background:\n\n• **Secondary Education:** Completed secondary education from India International School with a percentile of 80%.\n• **Diploma:** Completed Diploma in Civil Engineering from Asansol Polytechnic with a percentile of 70%.\n• **Currently Pursuing:** B.Tech in Computer Science & Engineering (CSE) — specializing in Software Engineering, Web Development, Data Structures, and Artificial Intelligence.";
      return NextResponse.json({
        question: rawQuestion.trim(),
        reply: eduReply,
        answer: eduReply,
        source: 'education_handler',
      });
    }

    // 3. GIRLFRIEND / RELATIONSHIP INQUIRY
    if (
      cleanQuestion.includes('girlfriend') ||
      cleanQuestion.includes('gf') ||
      cleanQuestion.includes('single') ||
      cleanQuestion.includes('dating') ||
      cleanQuestion.includes('relationship')
    ) {
      const gfReply = "Tushar is single. His heart belongs to his laptop... Or to speak the truth, I don't know the exact count 😉. If you want, I can ask him and get back to you 😉.";
      return NextResponse.json({
        question: rawQuestion.trim(),
        reply: gfReply,
        answer: gfReply,
        source: 'girlfriend_handler',
      });
    }

    // 4. FAMILY INQUIRY
    if (
      cleanQuestion.includes('family') ||
      cleanQuestion.includes('parents') ||
      cleanQuestion.includes('mother')
    ) {
      const famReply = "Yes, Tushar is blessed with a loving family. He has a loving mother.";
      return NextResponse.json({
        question: rawQuestion.trim(),
        reply: famReply,
        answer: famReply,
        source: 'family_handler',
      });
    }

    // 5. INTERESTS & HOBBIES INQUIRY
    if (
      cleanQuestion.includes('interest') ||
      cleanQuestion.includes('interests') ||
      cleanQuestion.includes('hobby') ||
      cleanQuestion.includes('hobbies') ||
      cleanQuestion.includes('passion') ||
      cleanQuestion.includes('passionate') ||
      cleanQuestion.includes('free time') ||
      cleanQuestion.includes('like to do')
    ) {
      const interestReply = "Tushar's Interests & Hobbies:\n\n• **Technical Interests:** Building 3D Interactive Web Experiences (Three.js & WebGL), AI Agent Architectures, RAG Pipelines, and Open Source Software.\n• **Personal Hobbies:** Exploring new AI models & tools, UI/UX graphic design experimentation, tech blogging, and music.";
      return NextResponse.json({
        question: rawQuestion.trim(),
        reply: interestReply,
        answer: interestReply,
        source: 'interests_handler',
      });
    }

    // 6. CODING LANGUAGES KNOWN INQUIRY
    if (
      cleanQuestion.includes('coding language') ||
      cleanQuestion.includes('programming language') ||
      cleanQuestion.includes('languages known') ||
      cleanQuestion.includes('languages you know') ||
      cleanQuestion.includes('languages tushar knows') ||
      cleanQuestion.includes('languages') ||
      cleanQuestion.includes('code in')
    ) {
      const langReply = "Tushar is proficient in the following programming languages & technologies:\n\n• **Coding Languages:** JavaScript (ES6+), TypeScript, Python, HTML5, CSS3, SQL\n• **Frameworks & Runtimes:** React, Next.js, Node.js, Express, FastAPI, Three.js / WebGL, Tailwind CSS\n• **Databases & Tools:** Supabase, PostgreSQL, MongoDB, Git, Docker, Vercel";
      return NextResponse.json({
        question: rawQuestion.trim(),
        reply: langReply,
        answer: langReply,
        source: 'languages_handler',
      });
    }

    // 7. RESUME INQUIRY
    if (
      cleanQuestion.includes('resume') ||
      cleanQuestion.includes('cv') ||
      cleanQuestion.includes('download resume') ||
      cleanQuestion.includes('curriculum vitae')
    ) {
      const resumeReply = "You can preview and download Tushar's updated resume PDF right here: /resume.pdf ! It outlines his experience in Full Stack Web Development, 3D WebGL, and AI Application Architecture.";
      return NextResponse.json({
        question: rawQuestion.trim(),
        reply: resumeReply,
        answer: resumeReply,
        source: 'resume_handler',
      });
    }

    // 8. CERTIFICATION INQUIRY
    if (
      cleanQuestion.includes('certif') ||
      cleanQuestion.includes('credential') ||
      cleanQuestion.includes('license')
    ) {
      if (liveCerts.length > 0) {
        let certText = `Tushar holds **${liveCerts.length} official certification(s)**:\n\n`;
        liveCerts.forEach((c, idx) => {
          certText += `${idx + 1}. **${c.title}**\n   • Issuer: ${c.issuer}${c.date ? ` (${c.date})` : ''}\n`;
          if (c.url) certText += `   🔗 Verification: ${c.url}\n`;
          certText += '\n';
        });
        return NextResponse.json({
          question: rawQuestion.trim(),
          reply: certText.trim(),
          answer: certText.trim(),
          source: 'supabase_certificates',
        });
      } else {
        const noCertReply = "Tushar haven't added any certification yet.";
        return NextResponse.json({
          question: rawQuestion.trim(),
          reply: noCertReply,
          answer: noCertReply,
          source: 'no_certificates',
        });
      }
    }

    // 9. PROJECTS INQUIRY (General or Specific Project)
    const isGeneralProjectQuery =
      cleanQuestion.includes('project') ||
      cleanQuestion.includes('projects') ||
      cleanQuestion.includes('work') ||
      cleanQuestion.includes('built') ||
      cleanQuestion.includes('apps') ||
      cleanQuestion.includes('portfolio');

    if (isGeneralProjectQuery) {
      if (liveProjects.length > 0) {
        let projectText = `Tushar has built **${liveProjects.length} project(s)** in his portfolio:\n\n`;
        liveProjects.forEach((p, idx) => {
          const summaryText = p.summary?.trim() || p.description;
          const techStr = Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : 'Full Stack';
          projectText += `${idx + 1}. **${p.title}**\n`;
          projectText += `   • **Summary:** ${summaryText}\n`;
          projectText += `   • **Tech Stack:** ${techStr}\n`;
          if (p.live_url) projectText += `   🔗 **Live Demo:** ${p.live_url}\n`;
          if (p.github_url) projectText += `   🐙 **GitHub:** ${p.github_url}\n`;
          projectText += '\n';
        });
        return NextResponse.json({
          question: rawQuestion.trim(),
          reply: projectText.trim(),
          answer: projectText.trim(),
          source: 'all_projects_list',
        });
      } else {
        const noProjectReply = "Tushar haven't added any project yet.";
        return NextResponse.json({
          question: rawQuestion.trim(),
          reply: noProjectReply,
          answer: noProjectReply,
          source: 'no_projects',
        });
      }
    }

    // Check if user specifically mentioned a specific project by name
    const matchedProject = liveProjects.find((p) =>
      cleanQuestion.includes(p.title.toLowerCase()) || p.title.toLowerCase().includes(cleanQuestion)
    );

    if (matchedProject) {
      if (cleanQuestion.includes('github') || cleanQuestion.includes('repo') || cleanQuestion.includes('code')) {
        if (matchedProject.github_url) {
          const ghReply = `The GitHub repository for **${matchedProject.title}** is available here:\n${matchedProject.github_url}`;
          return NextResponse.json({
            question: rawQuestion.trim(),
            reply: ghReply,
            answer: ghReply,
            source: 'supabase_project_github',
          });
        }
      }

      if (cleanQuestion.includes('live') || cleanQuestion.includes('demo') || cleanQuestion.includes('link') || cleanQuestion.includes('url')) {
        if (matchedProject.live_url) {
          const liveReply = `You can check out the live demo of **${matchedProject.title}** here:\n${matchedProject.live_url}`;
          return NextResponse.json({
            question: rawQuestion.trim(),
            reply: liveReply,
            answer: liveReply,
            source: 'supabase_project_live',
          });
        }
      }

      const detailedText = matchedProject.summary?.trim() || matchedProject.description;
      const techStackStr = Array.isArray(matchedProject.tech_stack)
        ? matchedProject.tech_stack.join(', ')
        : 'Full Stack';

      let responseText = `**${matchedProject.title}** is a featured project built by Tushar.\n\n• **Summary:** ${detailedText}\n• **Tech Stack:** ${techStackStr}`;
      if (matchedProject.live_url) responseText += `\n• **Live Demo:** ${matchedProject.live_url}`;
      if (matchedProject.github_url) responseText += `\n• **GitHub:** ${matchedProject.github_url}`;

      return NextResponse.json({
        question: rawQuestion.trim(),
        reply: responseText,
        answer: responseText,
        source: 'supabase_project_full_details',
      });
    }

    // 10. Gemini API generation if API Key is configured
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      try {
        const liveContext = await getLivePortfolioContextSummary();
        const systemPrompt = `You are TusharAI, Tushar Singh's personal 3D Portfolio AI Assistant. Answer the user's question accurately, enthusiastically, and professionally in 2-3 concise sentences using the complete candidate database context (Education, Interests, Coding Languages, Projects, Certifications, Resume) below.\n\n${liveContext}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\nVisitor Question: "${rawQuestion.trim()}"` }],
                },
              ],
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const geminiAnswer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (geminiAnswer) {
            return NextResponse.json({
              question: rawQuestion.trim(),
              reply: geminiAnswer.trim(),
              answer: geminiAnswer.trim(),
              source: 'gemini_rag',
            });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API fetch warning:', geminiErr);
      }
    }

    // 11. Fallback to local knowledge engine
    const answer = getAvatarResponse(rawQuestion.trim());

    return NextResponse.json({
      question: rawQuestion.trim(),
      reply: answer,
      answer,
      source: 'knowledge_engine',
    });
  } catch (error) {
    console.error('Avatar chat API error:', error);
    return NextResponse.json(
      {
        reply: "I'm unable to recognize that question. Please check your sentence or typo!",
        answer: "I'm unable to recognize that question. Please check your sentence or typo!",
      },
      { status: 200 }
    );
  }
}
