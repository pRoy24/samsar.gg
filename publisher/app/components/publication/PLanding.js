import React from 'react';

export default function PLanding(props) {
  const { meta } = props;
  return (
    <ThirdwebProvider>
      <PublicationHome meta={meta} />
    </ThirdwebProvider>
  )
}