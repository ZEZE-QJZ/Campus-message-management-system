import React from "react";
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";

export default function Published() {
  const { dataSource, setHandleData } = usePublish(1)

  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        setHandleData={setHandleData}
        publishState='1'
      ></NewsPublish>
    </div>
  )
}