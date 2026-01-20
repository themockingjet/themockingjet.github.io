import { Icon } from "@iconify/react/dist/iconify.js";
import { Footer } from "./components/footer";
import { Projects } from "./components/projects";
import { Skills } from "./components/skills";
import { Particles } from "./components/particles/Particles";

function App() {
  return (
    <>
      <Particles />
      <div className="min-h-screen font-sans select-none">
        <div className="lg:container mx-auto px-4 py-8 md:px-8 md:py-12 flex flex-col min-h-screen">
          <header className="mb-6 pb-6">
            <h1 className="text-4xl lg:text-7xl font-bold text-white">
              themockingjet
            </h1>
            <div className="flex text-gray-300 mt-2 space-x-4">
              <div className="flex space-x-1 items-center">
                <Icon icon="circle-flags:ph" className="w-6 h-6 mr-2" />
                <span className="text-sm">Philippines</span>
              </div>
              <div className="flex space-x-1 items-center">
                <Icon icon="mdi:github" className="w-6 h-6" />
                <a href="http://github.com/themockingjet" className="underline">
                  themockingjet
                </a>
              </div>
            </div>
          </header>

          <main className="flex-grow">
            <section id="description" className="w-full mb-8">
              <div className="max-w-3xl">
                <p className="text-gray-200 leading-relaxed text-lg font-light">
                  Hi, I'm <span className="font-bold">Jet</span>.
                </p>
                <p className="text-gray-300 leading-relaxed text-lg mt-4">
                  I create automation tools using AutoHotkey and build CLI apps
                  with Python. Lately, I've been learning web development by
                  working on personal projects with
                  <span className="text-sky-300"> React</span>,
                  <span className="text-orange-500"> Svelte</span>,
                  <span className="text-yellow-400"> Bun</span>, and
                  <span className="text-blue-500"> TypeScript</span>.
                </p>

                <div className="mt-4 text-sm text-gray-400 flex items-center font-sans italic">
                  <span className="h-px w-6 bg-gray-600 mr-3"></span>
                  This site is evolving — check back later for new projects and
                  updates.
                </div>
              </div>
            </section>

            <Projects />
            <Skills />
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
