import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './models/User.js';
import { Skill } from './models/Skill.js';
import { SwapRequest } from './models/SwapRequest.js';

dotenv.config();

export const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`[Seed] Database already contains ${userCount} users. Skipping auto-seed.`);
      return;
    }

    console.log('[Seed] Populating database with initial SkillSwap student profiles and listings...');

    const defaultPassword = await bcrypt.hash('password123', 10);

    const usersData = [
      {
        name: 'Alex Chen',
        email: 'alex.chen@campus.edu',
        password: defaultPassword,
        college: 'UC Berkeley',
        major: 'Computer Science',
        bio: 'Senior CS student specializing in distributed systems and React. Love teaching frontend tech in exchange for guitar or conversational Spanish!',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
        karma: 340,
        skillsTeaching: ['React & Node.js', 'Data Structures', 'TypeScript'],
        skillsLearning: ['Acoustic Guitar', 'Spanish', 'UI Design'],
        rating: 4.9,
        reviewsCount: 18,
        badges: ['Top Peer Tutor', 'Code Wizard', 'Verified Student'],
      },
      {
        name: 'Maya Patel',
        email: 'maya.patel@campus.edu',
        password: defaultPassword,
        college: 'Stanford University',
        major: 'Human-Computer Interaction',
        bio: 'Product designer passionate about accessible user experiences and Figma design systems. Looking to learn Python for data visualization!',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
        karma: 410,
        skillsTeaching: ['Figma Prototyping', 'UI/UX Design Systems', 'User Research'],
        skillsLearning: ['Python for Data', 'Web Development'],
        rating: 5.0,
        reviewsCount: 22,
        badges: ['Design Master', 'Community Star', 'Verified Student'],
      },
      {
        name: 'Liam Rodriguez',
        email: 'liam.r@campus.edu',
        password: defaultPassword,
        college: 'UT Austin',
        major: 'Applied Mathematics',
        bio: 'Math enthusiast offering deep dive tutoring in Calculus I-III and Linear Algebra. Want to swap for French conversation or photography.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        karma: 290,
        skillsTeaching: ['Calculus & Linear Algebra', 'Differential Equations', 'LaTeX'],
        skillsLearning: ['French Language', 'Digital Photography'],
        rating: 4.8,
        reviewsCount: 14,
        badges: ['Math Genius', 'Patient Tutor', 'Verified Student'],
      },
      {
        name: 'Chloe Dubois',
        email: 'chloe.dubois@campus.edu',
        password: defaultPassword,
        college: 'NYU',
        major: 'Comparative Literature',
        bio: 'Native French speaker from Lyon studying in NYC. Happy to do conversational French or accent coaching in exchange for web dev or guitar!',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
        karma: 360,
        skillsTeaching: ['Conversational French', 'French Literature', 'Essay Editing'],
        skillsLearning: ['JavaScript Basics', 'Acoustic Guitar'],
        rating: 5.0,
        reviewsCount: 19,
        badges: ['Polyglot', 'Top Peer Tutor', 'Verified Student'],
      },
    ];

    const createdUsers = await User.insertMany(usersData);
    console.log(`[Seed] Created ${createdUsers.length} student profiles.`);

    const skillsData = [
      {
        title: 'Full-Stack React & Node.js Mastery',
        category: 'Code & Tech',
        description: 'Hands-on pair programming session covering modern React hooks, state management, RESTful APIs, and debugging full-stack web applications.',
        user: createdUsers[0]._id,
        skillWanted: 'Acoustic Guitar or Spanish',
        level: 'Intermediate',
        format: 'Online / Video Call',
        sessionLength: '60 mins',
        college: 'UC Berkeley',
        tags: ['React', 'JavaScript', 'Node.js', 'Frontend'],
        rating: 4.9,
        swapsCompleted: 12,
      },
      {
        title: 'Figma UI/UX & Interactive Prototyping',
        category: 'Design & Creative',
        description: 'Learn how to build real component libraries, auto-layout workflows, micro-interactions, and design high-converting web and mobile mockups in Figma.',
        user: createdUsers[1]._id,
        skillWanted: 'Python for Data Analysis',
        level: 'All Levels',
        format: 'Online / Video Call',
        sessionLength: '45 mins',
        college: 'Stanford University',
        tags: ['Figma', 'UI/UX', 'Product Design', 'Prototyping'],
        rating: 5.0,
        swapsCompleted: 15,
      },
      {
        title: 'Calculus II & Linear Algebra Problem Solving',
        category: 'Academics & Math',
        description: 'Exam preparation, integration techniques, series, eigenvectors, and intuitive visual explanations to help you ace your STEM midterm.',
        user: createdUsers[2]._id,
        skillWanted: 'Conversational French',
        level: 'Intermediate',
        format: 'Flexible',
        sessionLength: '60 mins',
        college: 'UT Austin',
        tags: ['Calculus', 'Linear Algebra', 'Math', 'STEM'],
        rating: 4.8,
        swapsCompleted: 9,
      },
      {
        title: 'Conversational French & Pronunciation Coach',
        category: 'Languages',
        description: 'Casual, confidence-building French dialogue for everyday conversations, study abroad prep, slang, and Parisian cultural etiquette.',
        user: createdUsers[3]._id,
        skillWanted: 'Web Development Basics',
        level: 'Beginner',
        format: 'Online / Video Call',
        sessionLength: '45 mins',
        college: 'NYU',
        tags: ['French', 'Languages', 'Culture', 'Conversation'],
        rating: 5.0,
        swapsCompleted: 14,
      },
      {
        title: 'Python for Beginners & Data Automation',
        category: 'Code & Tech',
        description: 'Step-by-step introduction to Python syntax, loops, functions, file reading, and simple automation scripts to boost your workflow.',
        user: createdUsers[0]._id,
        skillWanted: 'Figma or Video Editing',
        level: 'Beginner',
        format: 'Online / Video Call',
        sessionLength: '45 mins',
        college: 'UC Berkeley',
        tags: ['Python', 'Automation', 'Coding', 'Beginners'],
        rating: 4.9,
        swapsCompleted: 8,
      },
      {
        title: 'Academic Writing & Essay Structuring',
        category: 'Academics & Math',
        description: 'Crafting persuasive thesis statements, organizing multi-page research papers, peer reviewing drafts, and perfecting citations (MLA/APA).',
        user: createdUsers[3]._id,
        skillWanted: 'Graphic Design Basics',
        level: 'All Levels',
        format: 'Online / Video Call',
        sessionLength: '45 mins',
        college: 'NYU',
        tags: ['Writing', 'Essays', 'Literature', 'Research'],
        rating: 4.9,
        swapsCompleted: 6,
      },
    ];

    const createdSkills = await Skill.insertMany(skillsData);
    console.log(`[Seed] Created ${createdSkills.length} skill listings.`);

    // Create a sample active swap between Alex and Maya
    const sampleSwap = new SwapRequest({
      requester: createdUsers[0]._id,
      receiver: createdUsers[1]._id,
      skill: createdSkills[1]._id,
      skillOffered: 'React & Frontend Architecture',
      skillRequested: 'Figma UI/UX & Interactive Prototyping',
      proposedTopic: 'Design System & Component Mapping in React',
      message: 'Hey Maya! I would love to learn Figma component variants from you in exchange for showing you React hooks.',
      status: 'accepted',
      scheduledDate: '2026-10-30',
      scheduledTime: '16:00 EST',
      meetingLink: 'https://meet.skillswap.edu/room-alex-maya-design',
      messages: [
        {
          sender: createdUsers[0]._id,
          senderName: 'Alex Chen',
          text: 'Hey Maya! Excited for our session. I have prepared some starter code for us.',
        },
        {
          sender: createdUsers[1]._id,
          senderName: 'Maya Patel',
          text: 'Sounds perfect Alex! I put together a Figma file with auto-layout templates for you.',
        },
      ],
    });

    // Create a sample completed swap with review
    const completedSwap = new SwapRequest({
      requester: createdUsers[2]._id,
      receiver: createdUsers[3]._id,
      skill: createdSkills[3]._id,
      skillOffered: 'Calculus II Integration Techniques',
      skillRequested: 'Conversational French & Pronunciation',
      proposedTopic: 'French Conversation Practice: Paris Travel',
      message: 'Looking forward to practicing French dialogues before my winter semester in France!',
      status: 'completed',
      scheduledDate: '2026-10-20',
      scheduledTime: '14:00 EST',
      meetingLink: 'https://meet.skillswap.edu/room-liam-chloe',
      messages: [
        {
          sender: createdUsers[2]._id,
          senderName: 'Liam Rodriguez',
          text: 'Merci beaucoup Chloe! That was such an encouraging session.',
        },
        {
          sender: createdUsers[3]._id,
          senderName: 'Chloe Dubois',
          text: 'De rien Liam! Your French pronunciation improved so much in just 45 minutes.',
        },
      ],
      review: {
        rating: 5,
        comment: 'Chloe is an incredible tutor! Extremely encouraging, patient, and made French feel natural and fun.',
        submittedAt: new Date(Date.now() - 3600000 * 48),
      },
    });

    await sampleSwap.save();
    await completedSwap.save();

    console.log('[Seed] Sample swaps and messages successfully seeded.');
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
};
