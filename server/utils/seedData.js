const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const seedUsers = async () => {
    try {
        // Create recruiters
        const recruiters = [
            {
                email: 'sarah.tech@techcorp.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'Sarah Johnson',
                userType: 'recruiter',
                company: 'TechCorp Solutions',
                position: 'Senior Technical Recruiter',
                phone: '+1234567890',
                location: 'San Francisco, CA',
                companyWebsite: 'www.techcorp.com',
                companyDescription: 'Leading software development company specializing in enterprise solutions',
                isProfileComplete: true,
                isVerified: true
            },
            {
                email: 'mike.hr@innovatech.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'Michael Brown',
                userType: 'recruiter',
                company: 'InnovaTech',
                position: 'HR Manager',
                phone: '+1234567891',
                location: 'New York, NY',
                companyWebsite: 'www.innovatech.com',
                companyDescription: 'AI and Machine Learning focused tech company',
                isProfileComplete: true,
                isVerified: true
            },
            {
                email: 'jennifer.recruit@globalsoft.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'Jennifer Lee',
                userType: 'recruiter',
                company: 'GlobalSoft Inc',
                position: 'Talent Acquisition Lead',
                phone: '+1234567892',
                location: 'Seattle, WA',
                companyWebsite: 'www.globalsoft.com',
                companyDescription: 'Global software solutions provider',
                isProfileComplete: true,
                isVerified: true
            },
            {
                email: 'david.talent@futuretech.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'David Wilson',
                userType: 'recruiter',
                company: 'FutureTech',
                position: 'Technical Recruiter',
                phone: '+1234567893',
                location: 'Austin, TX',
                companyWebsite: 'www.futuretech.com',
                companyDescription: 'Innovative startup focusing on emerging technologies',
                isProfileComplete: true,
                isVerified: true
            }
        ];

        // Create jobseekers
        const jobseekers = [
            {
                email: 'john.dev@gmail.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'John Smith',
                userType: 'jobseeker',
                phone: '+1234567894',
                location: 'Boston, MA',
                skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
                experience: '5 years of full-stack development',
                bio: 'Senior Full Stack Developer with expertise in MERN stack',
                education: 'BS in Computer Science',
                isProfileComplete: true,
                isVerified: true
            },
            {
                email: 'anna.ui@gmail.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'Anna Martinez',
                userType: 'jobseeker',
                phone: '+1234567895',
                location: 'Los Angeles, CA',
                skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'HTML/CSS'],
                experience: '3 years in UI/UX design',
                bio: 'Creative UI/UX Designer passionate about user-centered design',
                education: 'BFA in Digital Design',
                isProfileComplete: true,
                isVerified: true
            },
            {
                email: 'peter.mobile@gmail.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'Peter Chen',
                userType: 'jobseeker',
                phone: '+1234567896',
                location: 'San Jose, CA',
                skills: ['iOS Development', 'Swift', 'SwiftUI', 'React Native'],
                experience: '4 years of mobile development',
                bio: 'Mobile Developer specialized in iOS and cross-platform development',
                education: 'MS in Software Engineering',
                isProfileComplete: true,
                isVerified: true
            },
            {
                email: 'rachel.data@gmail.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'Rachel Thompson',
                userType: 'jobseeker',
                phone: '+1234567897',
                location: 'Chicago, IL',
                skills: ['Python', 'Data Analysis', 'Machine Learning', 'SQL'],
                experience: '3 years in data science',
                bio: 'Data Scientist with strong analytical and programming skills',
                education: 'MS in Data Science',
                isProfileComplete: true,
                isVerified: true
            },
            {
                email: 'james.cloud@gmail.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'James Anderson',
                userType: 'jobseeker',
                phone: '+1234567898',
                location: 'Denver, CO',
                skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
                experience: '6 years in DevOps',
                bio: 'DevOps Engineer with extensive cloud infrastructure experience',
                education: 'BS in Information Technology',
                isProfileComplete: true,
                isVerified: true
            },
            {
                email: 'emily.security@gmail.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'Emily White',
                userType: 'jobseeker',
                phone: '+1234567899',
                location: 'Washington, DC',
                skills: ['Cybersecurity', 'Network Security', 'Penetration Testing'],
                experience: '4 years in cybersecurity',
                bio: 'Security Engineer focused on protecting digital assets',
                education: 'BS in Cybersecurity',
                isProfileComplete: true,
                isVerified: true
            },
            {
                email: 'alex.game@gmail.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'Alex Rodriguez',
                userType: 'jobseeker',
                phone: '+1234567900',
                location: 'Seattle, WA',
                skills: ['Unity3D', 'C#', 'Game Development', 'AR/VR'],
                experience: '3 years in game development',
                bio: 'Game Developer passionate about creating immersive experiences',
                education: 'BS in Game Design',
                isProfileComplete: true,
                isVerified: true
            },
            {
                email: 'lisa.backend@gmail.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'Lisa Kim',
                userType: 'jobseeker',
                phone: '+1234567901',
                location: 'Portland, OR',
                skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL'],
                experience: '5 years in backend development',
                bio: 'Backend Developer specialized in Java enterprise applications',
                education: 'MS in Computer Engineering',
                isProfileComplete: true,
                isVerified: true
            },
            {
                email: 'mark.frontend@gmail.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'Mark Taylor',
                userType: 'jobseeker',
                phone: '+1234567902',
                location: 'Miami, FL',
                skills: ['React', 'Vue.js', 'TypeScript', 'CSS3'],
                experience: '4 years in frontend development',
                bio: 'Frontend Developer creating beautiful and responsive web applications',
                education: 'BS in Web Development',
                isProfileComplete: true,
                isVerified: true
            },
            {
                email: 'sarah.ai@gmail.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'Sarah Patel',
                userType: 'jobseeker',
                phone: '+1234567903',
                location: 'San Diego, CA',
                skills: ['Machine Learning', 'Deep Learning', 'TensorFlow', 'Python'],
                experience: '3 years in AI/ML',
                bio: 'AI Engineer specializing in deep learning and computer vision',
                education: 'PhD in Artificial Intelligence',
                isProfileComplete: true,
                isVerified: true
            }
        ];

        // Insert users into database
        // Clear existing collections
        await User.deleteMany({});
        await Job.deleteMany({});
        await Application.deleteMany({});

        // Insert users
        const createdRecruiters = await User.insertMany(recruiters);
        const createdJobseekers = await User.insertMany(jobseekers);

        // Create jobs
        const jobs = [
            // TechCorp Solutions Jobs (Sarah Johnson)
            {
                title: 'Principal Software Architect',
                company: 'TechCorp Solutions',
                location: 'San Francisco, CA',
                type: 'full-time',
                remote: true,
                salary: {
                    min: 160000,
                    max: 220000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: 'lead',
                description: 'Looking for a Principal Software Architect to lead our technical strategy and system design.',
                requirements: [
                    '10+ years of software development experience',
                    'Strong background in distributed systems',
                    'Experience with cloud-native architectures',
                    'Track record of leading large-scale projects'
                ],
                responsibilities: [
                    'Define technical vision and roadmap',
                    'Design scalable system architectures',
                    'Lead technology selection and standards',
                    'Mentor senior developers'
                ],
                benefits: [
                    'Top-tier compensation',
                    'Equity package',
                    'Remote work',
                    'Executive benefits'
                ],
                skills: ['System Architecture', 'Cloud Architecture', 'Microservices', 'Leadership', 'Technical Strategy'],
                recruiter: createdRecruiters[0]._id,
                status: 'active',
                isUrgent: true
            },
            {
                title: 'Senior Full Stack Developer',
                company: 'TechCorp Solutions',
                location: 'San Francisco, CA',
                type: 'full-time',
                remote: true,
                salary: {
                    min: 120000,
                    max: 180000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: 'senior',
                description: 'Looking for a senior full-stack developer to lead development of enterprise applications.',
                requirements: [
                    'At least 5 years of experience with modern web technologies',
                    'Strong proficiency in React, Node.js, and cloud platforms',
                    'Experience with microservices architecture',
                    'Excellent problem-solving and leadership skills'
                ],
                responsibilities: [
                    'Lead development of enterprise-scale applications',
                    'Mentor junior developers',
                    'Design and implement scalable solutions',
                    'Collaborate with cross-functional teams'
                ],
                benefits: [
                    'Competitive salary',
                    'Remote work options',
                    'Health insurance',
                    'Stock options'
                ],
                skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
                recruiter: createdRecruiters[0]._id,
                status: 'active'
            },
            // InnovaTech Jobs (Michael Brown)
            {
                title: 'AI Research Scientist',
                company: 'InnovaTech',
                location: 'New York, NY',
                type: 'full-time',
                remote: false,
                salary: {
                    min: 150000,
                    max: 200000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: 'senior',
                description: 'Join our advanced AI research team to push the boundaries of artificial intelligence.',
                requirements: [
                    'PhD in Computer Science, AI, or related field',
                    'Published research in top-tier conferences',
                    'Experience with advanced AI models',
                    'Strong mathematical background'
                ],
                responsibilities: [
                    'Lead research initiatives',
                    'Develop novel AI algorithms',
                    'Publish research papers',
                    'Collaborate with academic partners'
                ],
                benefits: [
                    'Research budget',
                    'Conference travel',
                    'Publication bonus',
                    'Lab resources'
                ],
                skills: ['AI Research', 'Deep Learning', 'NLP', 'Computer Vision', 'Research Publications'],
                recruiter: createdRecruiters[1]._id,
                status: 'active',
                isFeatured: true
            },
            {
                title: 'Machine Learning Engineer',
                company: 'InnovaTech',
                location: 'New York, NY',
                type: 'full-time',
                remote: false,
                salary: {
                    min: 130000,
                    max: 190000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: 'senior',
                description: 'Join our AI team to develop cutting-edge machine learning solutions.',
                requirements: [
                    'MS/PhD in Computer Science or related field',
                    'Strong background in machine learning and deep learning',
                    'Experience with TensorFlow or PyTorch',
                    'Published research is a plus'
                ],
                responsibilities: [
                    'Develop and deploy ML models',
                    'Research and implement state-of-the-art algorithms',
                    'Collaborate with data scientists and engineers',
                    'Optimize model performance'
                ],
                benefits: [
                    'Competitive salary',
                    'Research budget',
                    'Conference attendance',
                    'Publication opportunities'
                ],
                skills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'MLOps'],
                recruiter: createdRecruiters[1]._id,
                status: 'active'
            },
            // GlobalSoft Inc Jobs (Jennifer Lee)
            {
                title: 'Frontend Team Lead',
                company: 'GlobalSoft Inc',
                location: 'Seattle, WA',
                type: 'full-time',
                remote: true,
                salary: {
                    min: 140000,
                    max: 180000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: 'lead',
                description: 'Seeking a Frontend Team Lead to drive our UI/UX initiatives and lead a team of developers.',
                requirements: [
                    '7+ years of frontend development',
                    'Experience leading development teams',
                    'Strong design system knowledge',
                    'Performance optimization expertise'
                ],
                responsibilities: [
                    'Lead frontend architecture',
                    'Manage team of developers',
                    'Drive technical decisions',
                    'Ensure code quality'
                ],
                benefits: [
                    'Competitive salary',
                    'Leadership training',
                    'Remote work',
                    'Professional development'
                ],
                skills: ['React', 'TypeScript', 'Team Leadership', 'Performance Optimization', 'Design Systems'],
                recruiter: createdRecruiters[2]._id,
                status: 'active'
            },
            {
                title: 'UI/UX Designer',
                company: 'GlobalSoft Inc',
                location: 'Seattle, WA',
                type: 'full-time',
                remote: true,
                salary: {
                    min: 90000,
                    max: 130000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: 'mid-level',
                description: 'Join our design team to create beautiful and intuitive user experiences.',
                requirements: [
                    '3+ years of UI/UX design experience',
                    'Strong portfolio',
                    'Experience with modern design tools',
                    'Understanding of user-centered design'
                ],
                responsibilities: [
                    'Create user interfaces',
                    'Conduct user research',
                    'Design prototypes',
                    'Collaborate with developers'
                ],
                benefits: [
                    'Creative environment',
                    'Design tool subscriptions',
                    'Remote work',
                    'Health benefits'
                ],
                skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
                recruiter: createdRecruiters[2]._id,
                status: 'active'
            },
            {
                title: 'Mobile App Developer',
                company: 'GlobalSoft Inc',
                location: 'Seattle, WA',
                type: 'full-time',
                remote: true,
                salary: {
                    min: 100000,
                    max: 150000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: 'mid-level',
                description: 'Join our mobile team to develop cross-platform applications.',
                requirements: [
                    '3+ years of mobile development experience',
                    'Proficiency in React Native or Flutter',
                    'Experience with native iOS/Android development',
                    'Strong UI/UX sensibilities'
                ],
                responsibilities: [
                    'Develop mobile applications',
                    'Implement new features',
                    'Optimize app performance',
                    'Write clean, maintainable code'
                ],
                benefits: [
                    'Flexible hours',
                    'Health benefits',
                    'Learning budget',
                    'Remote work'
                ],
                skills: ['React Native', 'iOS', 'Android', 'Flutter', 'Mobile Development'],
                recruiter: createdRecruiters[2]._id,
                status: 'active'
            },
            // FutureTech Jobs (David Wilson)
            {
                title: 'Senior Cloud Architect',
                company: 'FutureTech',
                location: 'Austin, TX',
                type: 'full-time',
                remote: true,
                salary: {
                    min: 140000,
                    max: 190000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: 'senior',
                description: 'Looking for a Senior Cloud Architect to design and implement our next-generation cloud infrastructure.',
                requirements: [
                    '7+ years of cloud architecture experience',
                    'Multi-cloud expertise (AWS, Azure, GCP)',
                    'Strong security background',
                    'Experience with large-scale systems'
                ],
                responsibilities: [
                    'Design cloud architecture',
                    'Implement security best practices',
                    'Optimize cloud costs',
                    'Lead cloud initiatives'
                ],
                benefits: [
                    'Competitive salary',
                    'Stock options',
                    'Remote work',
                    'Learning budget'
                ],
                skills: ['AWS', 'Azure', 'GCP', 'Cloud Architecture', 'Security'],
                recruiter: createdRecruiters[3]._id,
                status: 'active',
                isUrgent: true
            },
            {
                title: 'Full Stack JavaScript Developer',
                company: 'FutureTech',
                location: 'Austin, TX',
                type: 'full-time',
                remote: true,
                salary: {
                    min: 90000,
                    max: 130000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: 'mid-level',
                description: 'Join our team to build modern web applications using JavaScript technologies.',
                requirements: [
                    '3+ years of JavaScript development',
                    'Experience with modern frameworks',
                    'Strong CS fundamentals',
                    'Team player mindset'
                ],
                responsibilities: [
                    'Develop web applications',
                    'Write clean, maintainable code',
                    'Collaborate with team members',
                    'Participate in code reviews'
                ],
                benefits: [
                    'Competitive salary',
                    'Health insurance',
                    'Remote work',
                    'Professional development'
                ],
                skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB'],
                recruiter: createdRecruiters[3]._id,
                status: 'active'
            },
            {
                title: 'DevOps Engineer',
                company: 'FutureTech',
                location: 'Austin, TX',
                type: 'full-time',
                remote: true,
                salary: {
                    min: 110000,
                    max: 160000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: 'mid-level',
                description: 'Looking for a DevOps engineer to improve our infrastructure and deployment processes.',
                requirements: [
                    '4+ years of DevOps experience',
                    'Strong knowledge of AWS/Azure',
                    'Experience with CI/CD pipelines',
                    'Container orchestration expertise'
                ],
                responsibilities: [
                    'Manage cloud infrastructure',
                    'Implement CI/CD pipelines',
                    'Monitor system performance',
                    'Automate deployment processes'
                ],
                benefits: [
                    'Competitive salary',
                    'Remote work',
                    'Learning allowance',
                    'Health insurance'
                ],
                skills: ['AWS', 'Kubernetes', 'Docker', 'Jenkins', 'Terraform'],
                recruiter: createdRecruiters[3]._id,
                status: 'active'
            }
        ];

        const createdJobs = await Job.insertMany(jobs);

        // Create applications
        const applications = [
            // John Smith applies for Senior Full Stack Developer
            {
                job: createdJobs[0]._id,
                applicant: createdJobseekers[0]._id,
                status: 'reviewing',
                coverLetter: 'I am excited to apply for this position with my 5 years of full-stack development experience...',
                expectedSalary: {
                    amount: 150000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: '5 years of experience in full-stack development with React and Node.js...'
            },
            // Rachel Thompson applies for Machine Learning Engineer
            {
                job: createdJobs[1]._id,
                applicant: createdJobseekers[3]._id,
                status: 'pending',
                coverLetter: 'With my strong background in data science and machine learning...',
                expectedSalary: {
                    amount: 140000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: '3 years of experience in machine learning and data science...'
            },
            // Peter Chen applies for Mobile App Developer
            {
                job: createdJobs[2]._id,
                applicant: createdJobseekers[2]._id,
                status: 'shortlisted',
                coverLetter: 'As a mobile developer with experience in both iOS and React Native...',
                expectedSalary: {
                    amount: 130000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: '4 years of mobile development experience across iOS and React Native...'
            },
            // James Anderson applies for DevOps Engineer
            {
                job: createdJobs[3]._id,
                applicant: createdJobseekers[4]._id,
                status: 'interviewed',
                coverLetter: 'With my extensive experience in cloud infrastructure and DevOps practices...',
                expectedSalary: {
                    amount: 140000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: '6 years of experience in DevOps and cloud infrastructure...'
            }
        ];

        await Application.insertMany(applications);
        
        console.log('Database seeded successfully!');
        console.log(`Created:
- ${createdRecruiters.length} recruiters
- ${createdJobseekers.length} jobseekers
- ${createdJobs.length} jobs
- ${applications.length} applications`);

    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = seedUsers;
