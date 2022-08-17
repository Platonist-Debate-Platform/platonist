import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Homepage, RequestStatus } from '@platonist/library';
import {
  useAuthentication,
  useHomepage,
  usePages,
  useRoutes,
} from '../../Hooks';
import useUser from '../../Hooks/Requests/useUser';
import { EmailConfirmation } from '../Authentication';
import { ContactBox, Footer, FooterCopyright } from '../Footer';
import { NavbarComponent } from '../Navbar';
import {
  HomepageResolver,
  NotFound,
  PageAdmin,
  PageEmailConfirmation,
  PageLogin,
  PageLogout,
  PageProfile,
} from '../Pages';
import { PrivateRoute } from './PrivateRoute';
import { NotFoundRoute } from './NotFoundRoute';
import BlogArticlePage from '../Content/Blog/BlogArticlePage';

const HomepageRoutes: React.FC<Homepage> = (props) => {
  const authentication = useAuthentication();
  const { user } = useUser(authentication[1]?.id);

  const homepage = useHomepage(props.id);
  const pages = usePages(homepage.result && homepage.result.id);

  const routes = useRoutes({
    isAdmin: false,
    pages: pages?.result,
  });

  console.log(routes);
  return (
    <div className="page" id="page">
      {pages?.status === RequestStatus.Loaded && (
        <>
          <NavbarComponent
            homePageData={homepage.result}
            pages={pages && pages.result}
            user={user?.result}
          />
          <div className="main-body" id="main_body">
            <main>
              <Switch>
                <Route
                  path="/"
                  exact={true}
                  render={() => <HomepageResolver {...props} isAdmin={false} />}
                />
                {/* <Route
                  path="/Blog/:slug"
                  exact
                  render={() => <BlogArticlePage {...props}/>}
                /> */}
                {routes.map((route, index) => (
                  <Route {...route} key={`main_route_${index}`} />
                ))}
                <PrivateRoute
                  path="/user/me"
                  exact={true}
                  component={PageProfile}
                />
                <Route path="/admin" exact={false} component={PageAdmin} />
                <Route path="/auth/login" exact={true} component={PageLogin} />
                <Route
                  path="/auth/logout"
                  exact={true}
                  component={PageLogout}
                />
                <Route
                  path="/auth/email-confirmation"
                  exact={true}
                  component={PageEmailConfirmation}
                />
                <Route path="/404" exact={true} component={NotFound} />
                <Route component={NotFoundRoute} />
              </Switch>
            </main>
            {homepage.result && (
              <footer>
                <ContactBox contact={homepage.result.contact} />
                <Footer homepage={homepage.result} />
                <FooterCopyright {...homepage.result} />
              </footer>
            )}
          </div>
        </>
      )}
      {pages?.status === RequestStatus.Error && <Redirect to="/404" />}
      <EmailConfirmation />
    </div>
  );
};

export default HomepageRoutes;
