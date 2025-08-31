const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const Notification = require('../models/Notification');
const Analytics = require('../models/Analytics');
const Company = require('../models/Company');

const seedAdditionalData = async () => {
    try {
        console.log('Seeding additional data...');

        // Additional Jobseekers
        const additionalJobseekers = [
            {
                email: 'ryan.tech2@gmail.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'Ryan Thompson',
                userType: 'jobseeker',
                phone: '+1234567897',
                location: 'Seattle, WA',
                skills: ['Python', 'Data Science', 'Machine Learning', 'TensorFlow', 'SQL'],
                experience: '4 years in Data Science',
                bio: 'Data Scientist with expertise in machine learning and AI',
                education: 'MS in Computer Science',
                isProfileComplete: true,
                isVerified: true
            },
            {
                email: 'maria.design2@gmail.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'Maria Rodriguez',
                userType: 'jobseeker',
                phone: '+1234567898',
                location: 'Miami, FL',
                skills: ['UX Design', 'Adobe XD', 'Sketch', 'User Research', 'Prototyping'],
                experience: '5 years in UX/UI Design',
                bio: 'Senior UX Designer crafting user-centered digital experiences',
                education: 'BFA in Design',
                isProfileComplete: true,
                isVerified: true
            },
            {
                email: 'alex.cloud2@gmail.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'Alex Cloud',
                userType: 'jobseeker',
                phone: '+1234567899',
                location: 'Chicago, IL',
                skills: ['AWS', 'Azure', 'DevOps', 'Docker', 'Kubernetes'],
                experience: '6 years in Cloud Architecture',
                bio: 'Cloud Solutions Architect specializing in multi-cloud environments',
                education: 'BS in Software Engineering',
                isProfileComplete: true,
                isVerified: true
            }
        ];

        // Additional Recruiters
        const additionalRecruiters = [
            {
                email: 'sarah.hr2@techstartup.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'Sarah Williams',
                userType: 'recruiter',
                phone: '+1234567900',
                location: 'Austin, TX',
                company: 'TechStartup Inc',
                position: 'Senior Technical Recruiter',
                companyWebsite: 'www.techstartup.com',
                companyDescription: 'Innovative startup focusing on AI solutions',
                isProfileComplete: true,
                isVerified: true
            },
            {
                email: 'mike.talent2@bigtech.com',
                password: await bcrypt.hash('Password123!', 10),
                fullName: 'Mike Anderson',
                userType: 'recruiter',
                phone: '+1234567901',
                location: 'San Jose, CA',
                company: 'BigTech Solutions',
                position: 'Talent Acquisition Manager',
                companyWebsite: 'www.bigtech.com',
                companyDescription: 'Leading technology solutions provider',
                isProfileComplete: true,
                isVerified: true
            }
        ];

        // Insert users
        const createdJobseekers = await User.insertMany(additionalJobseekers);
        const createdRecruiters = await User.insertMany(additionalRecruiters);

        // Additional Companies
        const additionalCompanies = [
            {
                name: 'TechStartup Inc',
                owner: createdRecruiters[0]._id,
                website: 'www.techstartup.com',
                description: 'Innovative startup focusing on AI solutions',
                industry: 'Artificial Intelligence',
                size: '11-50',
                founded: 2022,
                locations: [
                    {
                        city: 'Austin',
                        state: 'TX',
                        country: 'USA',
                        isPrimary: true
                    }
                ],
                socialLinks: {
                    linkedin: 'linkedin.com/company/techstartup',
                    twitter: 'twitter.com/techstartup'
                },
                benefits: [
                    'Flexible work hours',
                    'Remote work options',
                    'Health insurance',
                    'Stock options'
                ],
                culture: {
                    values: ['Innovation', 'Collaboration', 'Growth'],
                    workEnvironment: 'Fast-paced, startup culture',
                    technologies: ['AI', 'Machine Learning', 'Cloud Computing']
                },
                metrics: {
                    employeeCount: 30,
                    jobsPosted: 5,
                    activeJobs: 3
                }
            },
            {
                name: 'BigTech Solutions',
                owner: createdRecruiters[1]._id,
                website: 'www.bigtech.com',
                description: 'Leading technology solutions provider',
                industry: 'Information Technology',
                size: '501-1000',
                founded: 2015,
                locations: [
                    {
                        city: 'San Jose',
                        state: 'CA',
                        country: 'USA',
                        isPrimary: true
                    },
                    {
                        city: 'Austin',
                        state: 'TX',
                        country: 'USA',
                        isPrimary: false
                    }
                ],
                socialLinks: {
                    linkedin: 'linkedin.com/company/bigtech',
                    twitter: 'twitter.com/bigtech'
                },
                benefits: [
                    'Competitive salary',
                    'Comprehensive benefits',
                    '401k matching',
                    'Professional development'
                ],
                culture: {
                    values: ['Excellence', 'Innovation', 'Customer Focus'],
                    workEnvironment: 'Professional and dynamic',
                    technologies: ['Cloud', 'AI', 'Blockchain']
                },
                metrics: {
                    employeeCount: 750,
                    jobsPosted: 15,
                    activeJobs: 8
                }
            }
        ];

        const createdCompanies = await Company.insertMany(additionalCompanies);

        // Additional Jobs
        const additionalJobs = [
            {
                title: 'Senior Data Scientist',
                company: 'TechStartup Inc',
                location: 'Austin, TX',
                type: 'full-time',
                remote: true,
                salary: {
                    min: 130000,
                    max: 180000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: 'senior',
                description: 'Looking for a Senior Data Scientist to lead our AI initiatives.',
                requirements: [
                    'PhD in Computer Science or related field',
                    'Strong background in machine learning',
                    '5+ years experience in data science',
                    'Experience with deep learning frameworks'
                ],
                responsibilities: [
                    'Lead ML projects',
                    'Develop AI solutions',
                    'Mentor junior data scientists',
                    'Collaborate with product teams'
                ],
                benefits: [
                    'Competitive salary',
                    'Equity package',
                    'Remote work',
                    'Learning budget'
                ],
                skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'AWS'],
                recruiter: createdRecruiters[0]._id,
                status: 'active'
            },
            {
                title: 'UX/UI Designer',
                company: 'BigTech Solutions',
                location: 'San Jose, CA',
                type: 'full-time',
                remote: false,
                salary: {
                    min: 110000,
                    max: 150000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: 'mid-level',
                description: 'Join our design team to create exceptional user experiences.',
                requirements: [
                    '5+ years of UX/UI design experience',
                    'Strong portfolio',
                    'Experience with design systems',
                    'User research experience'
                ],
                responsibilities: [
                    'Design user interfaces',
                    'Conduct user research',
                    'Create prototypes',
                    'Collaborate with developers'
                ],
                benefits: [
                    'Competitive salary',
                    'Health insurance',
                    'Stock options',
                    'Professional development'
                ],
                skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
                recruiter: createdRecruiters[1]._id,
                status: 'active'
            }
        ];

        const createdJobs = await Job.insertMany(additionalJobs);

        // Additional Applications
        const additionalApplications = [
            {
                job: createdJobs[0]._id,
                applicant: createdJobseekers[0]._id,
                status: 'reviewing',
                coverLetter: 'With my strong background in data science and machine learning...',
                expectedSalary: {
                    amount: 150000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: '4 years in Data Science'
            },
            {
                job: createdJobs[1]._id,
                applicant: createdJobseekers[1]._id,
                status: 'pending',
                coverLetter: 'As a senior UX designer with extensive experience...',
                expectedSalary: {
                    amount: 130000,
                    currency: 'USD',
                    period: 'yearly'
                },
                experience: '5 years in UX/UI Design'
            }
        ];

        await Application.insertMany(additionalApplications);

        // Additional Saved Jobs
        const additionalSavedJobs = [
            {
                user: createdJobseekers[0]._id,
                job: createdJobs[1]._id,
                notes: 'Interesting opportunity in UX/UI'
            },
            {
                user: createdJobseekers[1]._id,
                job: createdJobs[0]._id,
                notes: 'Potential career shift to Data Science'
            }
        ];

        await SavedJob.insertMany(additionalSavedJobs);

        // Additional Notifications
        const additionalNotifications = [
            {
                recipient: createdJobseekers[0]._id,
                type: 'application',
                title: 'Application Under Review',
                message: 'Your application for Senior Data Scientist position is being reviewed.',
                relatedId: createdJobs[0]._id,
                onModel: 'Job'
            },
            {
                recipient: createdJobseekers[1]._id,
                type: 'job',
                title: 'New Job Match',
                message: 'A new UX/UI Designer position matches your profile.',
                relatedId: createdJobs[1]._id,
                onModel: 'Job'
            }
        ];

        await Notification.insertMany(additionalNotifications);

        // Additional Analytics
        const additionalAnalytics = [
            {
                user: createdJobseekers[0]._id,
                type: 'application',
                metrics: {
                    views: 15,
                    applications: 3,
                    interviews: 1,
                    offers: 0,
                    rejections: 1
                },
                timeframe: {
                    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    end: new Date()
                }
            },
            {
                user: createdRecruiters[0]._id,
                type: 'company',
                metrics: {
                    views: 150,
                    applications: 25,
                    interviews: 8,
                    offers: 2,
                    rejections: 15
                },
                timeframe: {
                    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    end: new Date()
                }
            }
        ];

        await Analytics.insertMany(additionalAnalytics);

        console.log('Additional data seeded successfully');

    } catch (error) {
        console.error('Error seeding additional data:', error);
    }
};

module.exports = seedAdditionalData;
