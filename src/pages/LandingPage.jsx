import { InView } from "@/components/ui/in-view";
import React from "react";

const LandingPage = () => {
  return (
    <div className="w-full">
      {/* First section */}
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-4">
        <div className="py-12 text-center text-sm">Scroll down</div>
        <InView
          variants={{
            hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          viewOptions={{ margin: "0px 0px -200px 0px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="max-w-md">
            <p className="">
              <strong className="font-medium">
                Craft beautiful animated components with Motion-Primitives.
              </strong>{" "}
              Designed for developers and designers. The library leverages the
              power of Motion, with intuitive APIs that simplifies creating
              complex animations for any project. Start building more dynamic
              interfaces today.
            </p>
          </div>
        </InView>
      </div>

      {/* Second section */}
      <div className="min-h-screen w-full flex items-center justify-center px-4">
        <InView
          variants={{
            hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          viewOptions={{ margin: "0px 0px -200px 0px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="max-w-md">
            <p className="">
              <strong className="font-medium">
                Craft beautiful animated components with Motion-Primitives.
              </strong>{" "}
              Designed for developers and designers. The library leverages the
              power of Motion, with intuitive APIs that simplifies creating
              complex animations for any project. Start building more dynamic
              interfaces today.
            </p>
          </div>
        </InView>
      </div>

      {/* Last section */}
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 mb-16">
        <InView
          variants={{
            hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          viewOptions={{ margin: "0px 0px -200px 0px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="max-w-md">
            <p className="">
              <strong className="font-medium">Final section</strong> This is the
              last section of our content. Scroll down to see more.
            </p>
          </div>
        </InView>

        {/* Footer indicator */}
        <div className="mt-8">
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
