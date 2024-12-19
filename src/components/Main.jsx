import { Route, Switch } from "wouter";

import DotPattern from "@/components/ui/dot-pattern";
import Calculator from "@/components/Calculator";

export default function Main() {
  return (
    <main className="relative mx-auto flex w-full grow flex-col items-center justify-center bg-white md:max-w-5xl dark:bg-neutral-900">
      <Switch>
        <Route path="/">
          <>
            <Calculator className="z-10 h-[450px] w-[300px]" />
            <DotPattern className="z-0 [mask-image:radial-gradient(circle,white_0%,transparent_75%)]" />
          </>
        </Route>
        <Route>
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">404</h2>
            <p className="text-lg">Not Found</p>
          </div>
        </Route>
      </Switch>
    </main>
  );
}
