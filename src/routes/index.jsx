import { Switch, Route, Redirect, useLocation } from "react-router-dom"
import authRoutes from "./authRoutes"
import dashboardRoutes from "./dashboard-routes"
import fallbackRoutes from "./fallback-routes"
import FallbackLayout from "../layouts/FallbackLayout"
import DashboardLayout from "../layouts/DashboardLayout"
import { useSelector } from "react-redux"
import Fallback403 from "../views/exceptions/Fallback403.jsx"
import { animated, useTransition } from "react-spring"

const layouts = [
  {
    component: DashboardLayout,
    path: "/home",
    routes: dashboardRoutes,
    private: true,
  },
  {
    component: FallbackLayout,
    path: "/extra",
    routes: fallbackRoutes,
    private: false,
  },
]

const noAccessComponent = () => (
  <>
    <Fallback403 />
  </>
)

const AppRouter = () => {
  const token = useSelector((state) => state.auth.accessToken)
  const permissions = useSelector((state) => state.auth.permissions)
  const location = useLocation()
  const transitions = useTransition(location, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  if (!token)
    return (
      <Switch>
        {authRoutes.map((route) => (
          <Route
            path={route.path}
            exact={route.exact}
            key={route.id}
            render={(routeProps) => (
              <route.layout history={routeProps.history}>
                <route.component {...routeProps} />
              </route.layout>
            )}
          />
        ))}
        <Redirect to="/auth/login" />
      </Switch>
    )

  return (
    <Switch>
      {layouts.map((layout, index) => (
        <Route
          key={index}
          path={layout.path}
          render={(routeProps) => (
            <layout.component>
              {layout.path !== "/canvas" ? (
                transitions((props, item) => (
                  <animated.div style={props}>
                    <div style={{ position: "absolute", width: "100%" }}>
                      <Switch location={item}>
                        {layout.routes.map((route) => (
                          <Route
                            key={route.id}
                            path={route.path}
                            component={route.component
                              // ![...permissions, "dashboard"].includes(
                              //   route.permission
                              // )
                              //   ? noAccessComponent
                              //   : route.component
                            }
                            exact
                          />
                        ))}
                        {/* <Redirect from="*" to="/extra/fallback-404" /> */}
                      </Switch>
                    </div>
                  </animated.div>
                ))
              ) : (
                <Switch>
                  {layout.routes.map((route) => (
                    <Route
                      key={route.id}
                      path={route.path}
                      component={
                        !permissions.includes(route.permission)
                          ? noAccessComponent
                          : route.component
                      }
                      exact
                    />
                  ))}
                  {/* <Redirect from="*" to="/extra/fallback-404" /> */}
                </Switch>
              )}
            </layout.component>
          )}
        ></Route>
      ))}
      <Redirect from="/" to="/home/dashboard" />
      <Redirect from="*" to="/extra/fallback-404" />
    </Switch>
  )
}

export default AppRouter
