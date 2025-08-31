const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const SavedJob = require('../models/SavedJob');
const Analytics = require('../models/Analytics');

const seedCorrelatedData = async () => {
    try {
        // Existing user IDs from your data
        const hrRecruiterId = '68a1b203de23333dec03aa09';
        const vijayJobseekerId = '68ae7e072e3e2fd65e5f6e51';
        const muruganJobseekerId = '68a1a65519a3858f39cc9596';

        // Create jobs posted by hr@gmail.com
        const jobs = [
            {
                title: 'Senior React Native Developer',
                company: 'Tech Solutions Inc',
                location: 'Coimbatore, TN, IN',
                type: 'full-time',
                remote: true,
                salary: {
                    min: 20000,
                    max: 35000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: 'senior',
                description: 'Looking for an experienced React Native developer to lead our mobile app development team.',
                requirements: [
                    '5+ years experience in React Native',
                    'Strong JavaScript/TypeScript skills',
                    'Experience with state management (Redux/Context)',
                    'Knowledge of native iOS and Android development'
                ],
                responsibilities: [
                    'Lead mobile app development',
                    'Mentor junior developers',
                    'Architect scalable solutions',
                    'Code review and best practices'
                ],
                benefits: [
                    'Competitive salary',
                    'Health insurance',
                    'Flexible work hours',
                    'Learning allowance'
                ],
                skills: ['React Native', 'JavaScript', 'TypeScript', 'Redux', 'Git'],
                recruiter: hrRecruiterId,
                status: 'active'
            },
            {
                title: 'Full Stack Developer',
                company: 'Tech Solutions Inc',
                location: 'Coimbatore, TN, IN',
                type: 'full-time',
                remote: true,
                salary: {
                    min: 15000,
                    max: 25000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: 'mid-level',
                description: 'Seeking a Full Stack Developer with MERN stack expertise.',
                requirements: [
                    '3+ years experience in full stack development',
                    'Strong knowledge of MERN stack',
                    'Experience with RESTful APIs',
                    'Database design experience'
                ],
                responsibilities: [
                    'Develop full stack applications',
                    'API development and integration',
                    'Database management',
                    'Performance optimization'
                ],
                benefits: [
                    'Competitive package',
                    'Medical insurance',
                    'Work from home options',
                    'Professional development'
                ],
                skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
                recruiter: hrRecruiterId,
                status: 'active'
            },
            {
                title: 'UI/UX Designer',
                company: 'Tech Solutions Inc',
                location: 'Coimbatore, TN, IN',
                type: 'full-time',
                remote: false,
                salary: {
                    min: 12000,
                    max: 20000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: 'mid-level',
                description: 'Looking for a creative UI/UX Designer to join our product team.',
                requirements: [
                    '3+ years of UI/UX design experience',
                    'Proficiency in Figma and Adobe tools',
                    'Understanding of user-centered design principles',
                    'Portfolio showcasing web/mobile projects'
                ],
                responsibilities: [
                    'Create user interfaces',
                    'Design user experiences',
                    'Conduct user research',
                    'Create wireframes and prototypes'
                ],
                benefits: [
                    'Competitive salary',
                    'Health benefits',
                    'Learning opportunities',
                    'Modern work environment'
                ],
                skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
                recruiter: hrRecruiterId,
                status: 'active'
            }
        ];

        console.log('Creating new jobs...');
        const createdJobs = await Job.insertMany(jobs);

        // Create applications from jobseekers
        const applications = [
            {
                job: createdJobs[0]._id,
                applicant: vijayJobseekerId,
                status: 'pending',
                coverLetter: 'I am a skilled React Native developer with experience in building complex mobile applications...',
                expectedSalary: {
                    amount: 30000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: '4 years in mobile development'
            },
            {
                job: createdJobs[1]._id,
                applicant: muruganJobseekerId,
                status: 'reviewing',
                coverLetter: 'As a full stack developer with extensive MERN stack experience...',
                expectedSalary: {
                    amount: 22000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: '3 years in full stack development'
            },
            {
                job: createdJobs[2]._id,
                applicant: vijayJobseekerId,
                status: 'pending',
                coverLetter: 'I have a keen eye for design and extensive experience in creating user interfaces...',
                expectedSalary: {
                    amount: 18000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: '2 years in UI/UX design'
            }
        ];

        console.log('Creating job applications...');
        const createdApplications = await Application.insertMany(applications);

        // Create notifications for applications
        const notifications = [
            {
                recipient: hrRecruiterId,
                type: 'application',
                title: 'New Job Application',
                message: 'New application received for Senior React Native Developer position',
                relatedId: createdApplications[0]._id,
                onModel: 'Application'
            },
            {
                recipient: hrRecruiterId,
                type: 'application',
                title: 'New Job Application',
                message: 'New application received for Full Stack Developer position',
                relatedId: createdApplications[1]._id,
                onModel: 'Application'
            },
            {
                recipient: vijayJobseekerId,
                type: 'application',
                title: 'Application Status',
                message: 'Your application is under review',
                relatedId: createdApplications[0]._id,
                onModel: 'Application'
            },
            {
                recipient: muruganJobseekerId,
                type: 'application',
                title: 'Application Status',
                message: 'Your application is under review',
                relatedId: createdApplications[1]._id,
                onModel: 'Application'
            }
        ];

        console.log('Creating notifications...');
        await Notification.insertMany(notifications);

        // Create saved jobs
        const savedJobs = [
            {
                user: vijayJobseekerId,
                job: createdJobs[1]._id,
                notes: 'Interesting full stack position'
            },
            {
                user: muruganJobseekerId,
                job: createdJobs[0]._id,
                notes: 'Good React Native opportunity'
            }
        ];

        console.log('Creating saved jobs...');
        await SavedJob.insertMany(savedJobs);

        // Create analytics
        const analytics = [
            {
                user: hrRecruiterId,
                type: 'recruiter',
                metrics: {
                    jobsPosted: 3,
                    totalApplications: 3,
                    activeJobs: 3,
                    interviewsScheduled: 1,
                    offersExtended: 0
                },
                timeframe: {
                    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    end: new Date()
                }
            },
            {
                user: vijayJobseekerId,
                type: 'jobseeker',
                metrics: {
                    applicationsSubmitted: 2,
                    jobsSaved: 1,
                    profileViews: 5,
                    interviewsAttended: 0
                },
                timeframe: {
                    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    end: new Date()
                }
            },
            {
                user: muruganJobseekerId,
                type: 'jobseeker',
                metrics: {
                    applicationsSubmitted: 1,
                    jobsSaved: 1,
                    profileViews: 3,
                    interviewsAttended: 1
                },
                timeframe: {
                    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    end: new Date()
                }
            }
        ];

        console.log('Creating analytics...');
        await Analytics.insertMany(analytics);

        console.log('Successfully seeded correlated data for existing users');

    } catch (error) {
        console.error('Error seeding correlated data:', error);
    }
};

module.exports = seedCorrelatedData;
