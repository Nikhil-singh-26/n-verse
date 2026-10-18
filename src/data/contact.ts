import { profileData } from './profile';

export interface ContactInfo {
  name: string;
  role: string;
  headline: string;
  subheadline: string;
  email: string;
  github: string;
  linkedin: string;
  leetcode: string;
  resumeUrl: string;
}

export const contactData: ContactInfo = {
  name: profileData.name,
  role: profileData.role,
  headline: "LET'S CONNECT",
  subheadline: "Have an interesting project, an opportunity, or an idea worth building? Let's talk.",
  email: profileData.contactLinks.email,
  github: profileData.contactLinks.github || 'https://github.com/Nikhil-singh-26',
  linkedin: profileData.contactLinks.linkedin || 'https://linkedin.com/in/nikhil-singh-dev',
  leetcode: profileData.contactLinks.leetcode || 'https://leetcode.com/u/Nikhil_singh_26/',
  resumeUrl: profileData.contactLinks.resume || '/resume.pdf'
};
