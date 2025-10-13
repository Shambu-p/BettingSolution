import { DefaultNode } from "./Actions/DefaultNode";
import { DecisionNode } from "./Actions/DecisionNode";
import { TriggerNode } from "./Actions/TriggerNode";
import LoopNode from "./Actions/LoopNode";
import LoopEnd from "./Actions/LoopEnd";

export const nodeTypes = {
  defaultNode: DefaultNode,
  updateVariable: DefaultNode,
  getSingle: DefaultNode,
  fetchMultiple: DefaultNode,
  createRecord: DefaultNode,
  updateRecord: DefaultNode,
  deleteRecord: DefaultNode,
  setVariable: DefaultNode,
  setOutPut: DefaultNode,
  callSubFlow: DefaultNode,
  advanced: DefaultNode,
  approvalNode: DefaultNode,

  decisionNode: DecisionNode,

  triggerNode: TriggerNode,

  forEachLoop: LoopNode,
  whileLoop: LoopNode,
  forLoop: LoopNode,
  loopEnd: LoopEnd
};