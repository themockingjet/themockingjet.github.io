import AppLayout from "@components/layout/AppLayout";
import IntroductionSection from "@components/sections/01-intro/IntroductionSection";
import SummarySection from "@components/sections/02-summary/SummarySection";
import ProjectSection from "@components/sections/03-projects/ProjectSection";
import SkillSection from "@components/sections/04-skills/SkillSection";
import { Footer } from "@components/footer";

const App = () => {
  return (
    <AppLayout className="no-scrollbar">
      <IntroductionSection id="main-introduction" />
      {/* <SectionDivider /> */}
      <SummarySection id="main-summary" />
      {/* <SectionDivider /> */}
      <ProjectSection id="main-projects" />
      {/* <SectionDivider /> */}
      <SkillSection id="main-skills" />
      <Footer />
    </AppLayout>
  );
};

export default App;
