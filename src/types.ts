export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  role: string;
  year: string;
  metric?: string;
  imageAlt: string;
  imagePlaceholderColor: string; // Tailored gradient color overlay to keep it editorial
  link?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
}

export interface Service {
  type: string;
  title: string;
  description: string;
  capabilities: string[];
}

export interface MessageFormData {
  name: string;
  email: string;
  company: string;
  message: string;
  projectType: string;
}
