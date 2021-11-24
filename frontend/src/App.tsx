/** @jsx jsx */
import {jsx} from 'theme-ui';
import React, {useEffect, useState, useMemo} from 'react';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';
// import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import {Navigation} from './components/Navigation';
import {Footer} from './components/footer-components/Footer';
import {ScrollToTop} from './components/ScrollToTop';
import {LoadingScreen} from './components/loading-components/LoadingScreen';

import {useUnmountingDelay} from './utils/hooks';

import {Home} from './pages/Home';
import {Events} from './pages/Events';
import {Clubs} from './pages/Clubs';
import {CCalendar} from './pages/Calendar';
import {Map} from './pages/Map';
import {Gallery} from './pages/Gallery';
import {Media} from './pages/Media';
import {FAQ} from './pages/FAQ';
import {AboutUs} from './pages/AboutUs';

import {
  IInfoContext,
  InfoContext,
  TransparentCtx,
  ITransparentCtx,
  SetTransparentCtx,
  ISetTransparentCtx,
} from './utils/contexts';
import { theme } from './utils/theme';

const backendUrl = 'http://localhost:8080';
//const backendUrl = 'https://us-central1-newstuco.cloudfunctions.net/test';
// console.log(backendUrl);

const Main: React.FC = React.memo(() => {
  const [info, setInfo] = useState<IInfoContext | undefined>();
  const [showLoading, setShowLoading] = useState<boolean>(true);
  /** Speed to unmount the loading screen, in ms. */
  const unmountSpeed = 500;
  const shouldRenderLoading = useUnmountingDelay(showLoading, unmountSpeed);

  const getData = async () => {
    let data: IInfoContext;

    try {
      const res = await fetch(backendUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          accept: 'application/json',
        },
      });
      data = await res.json();
    } catch (e) {
      console.log(e);
    }

    setInfo(data);
  };

  useEffect(() => {
    getData();
  }, []);

  // Indicate that the load is done
  useEffect(() => {
    if (info) {
      setShowLoading(false);
    }
  }, [info]);

  // Load the awesome loader screen if need be
  if (shouldRenderLoading) {
    return (
      <LoadingScreen
        isMounted={showLoading}
        unmountSpeed={unmountSpeed}
        hasLoader={false}
        loadingImage={"android-chrome-192x192.png"}
      />
    );
  }

  // console.log(process.env.PUBLIC_URL);

  return (
    <InfoContext.Provider value={info}>
      <Router>
        <ScrollToTop />
        <Navigation />
        <Switch>
          <Route path="/events">
            <Events />
          </Route>
          <Route path="/clubs">
            <Clubs />
          </Route>
          <Route path="/calendar">
            <CCalendar />
          </Route>
          <Route path="/map">
            <Map />
          </Route>
          <Route path="/gallery">
            <Gallery />
          </Route>
          <Route path="/media">
            <Media />
          </Route>
          {/* <Route path="/faq">
            <FAQ />
          </Route> */}
          {/* <Route path="/about">
            <AboutUs />
          </Route> */}
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </InfoContext.Provider>
  );
});

const App: React.FC = () => {
  const [transparent, setTransparent] = useState<boolean>(true);
  

  //why is this split in two?
  //so it won't force a re-render on places that used setTransparent
  //if transparent changed but setTransparent didn't change
  const transparentCtx: ITransparentCtx = {
    transparent: transparent,
  };

  const setTransparentCtx: ISetTransparentCtx = {
    setTransparent: setTransparent,
  };

  //why do I have to wrap it around so many times?
  //don't ask me why, it's so this thing won't re-render
  //each time I use setTransparent
  const MemoMain: JSX.Element = useMemo(() => {
    return (
      <SetTransparentCtx.Provider value={setTransparentCtx}>
        <div sx={{bg: theme.colors.background.light}}>
          <Main />
        </div>
        
      </SetTransparentCtx.Provider>
    );
  }, []);

  return (
    <TransparentCtx.Provider value={transparentCtx}>
      {MemoMain}
    </TransparentCtx.Provider>
  );
};

export default App;
