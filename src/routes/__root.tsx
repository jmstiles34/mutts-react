import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import Header from '../components/Header'
import {SessionProvider} from '../contexts'

export const Route = createRootRoute({
  component: () => (
    <>
      <SessionProvider>
        <main>
          <Header />
          <Outlet />
        </main>
      </SessionProvider>
      <TanStackRouterDevtools />
    </>
  ),
});
