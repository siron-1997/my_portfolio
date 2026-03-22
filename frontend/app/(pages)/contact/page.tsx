import { Metadata } from 'next';
import { ContactForm, ProgressStatus, Sending } from '@/components/contact';
import { Container } from '@/components/common';
import { ContactFormProvider } from '@/contexts';

export const metadata: Metadata = {
  title: 'Contact',
};

export default function ContactPage() {
  return (
    <ContactFormProvider>
      <Sending />
      <div className="root_container">
        <Container className="top_container">
          <div className="container">
            <ProgressStatus />
            <ContactForm />
          </div>
        </Container>
      </div>
    </ContactFormProvider>
  );
}
