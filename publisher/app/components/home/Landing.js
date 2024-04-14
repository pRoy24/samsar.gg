import CommonContainer from "../common/CommonContainer.js";
import Section1 from "./Section1.js";
const NEXT_PUBLIC_CREATOR_APP = process.env.NEXT_PUBLIC_CREATOR_APP;

export default function Landing() {
  const gotoCreatorApp = () => {
    window.location.href = NEXT_PUBLIC_CREATOR_APP;
  }
  return (
    <div>
      <CommonContainer>
       <Section1 gotoCreatorApp={gotoCreatorApp}/>
      </CommonContainer>
    </div>
  )
}