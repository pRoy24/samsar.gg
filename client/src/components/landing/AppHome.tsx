import React from 'react';
import { useUser } from "../../contexts/UserContext";
import PublicLanding from "./PublicLanding.tsx";
import CreatorLanding from "./CreatorLanding.tsx";
import OverflowContainer from '../common/OverflowContainer.tsx';

export default function AppHome() {
  const { user, userFetching } = useUser();
  let currentView = <span />;

  if (!userFetching && !user) {
    currentView =  (
      <PublicLanding />
    )
  } else if (userFetching) {
    currentView = <span>Loading</span>
  } else if (user && user.fid) {
    currentView = (
      <div>
        <CreatorLanding />
      </div>
    )
  }

  return (
    <OverflowContainer>
      {currentView}
    </OverflowContainer>
  )
}
