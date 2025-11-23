import React, { useEffect } from 'react';
import Cal, { getCalApi } from "@calcom/embed-react";

const CalEmbed = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace":"30min"});
      cal("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-purple-200" style={{ minHeight: '630px' }}>
      <Cal 
        namespace="30min"
        calLink="deepak-yadav-04/30min"
        style={{width:"100%",height:"630px",overflow:"scroll"}}
        config={{"layout":"month_view"}}
      />
    </div>
  );
};

export default CalEmbed;
