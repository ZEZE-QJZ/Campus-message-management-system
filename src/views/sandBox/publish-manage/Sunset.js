import React from "react";
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";

export default function Published() {
  const { dataSource, setHandleData } = usePublish(3)

  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        setHandleData={setHandleData}
        publishState='3'
      ></NewsPublish>
    </div>
  )
}