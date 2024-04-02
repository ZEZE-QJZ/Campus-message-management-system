export const CollapsedReducer = (prevState = {
  isCollapsed: false
}, action) => {
  let { type } = action;
  switch(type) {
    case "change_collapsed": // 侧边折叠栏控制
      let newState = {...prevState};
      newState.isCollapsed = !newState.isCollapsed;
      return newState
    default:
      return prevState
  };
};