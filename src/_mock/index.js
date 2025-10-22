// msw 是 Mock Service Worker的简写，是一个基于 Service Worker 实现的 API 模拟库，允许您编写与客户端无关的模
import { setupWorker } from "msw/browser";

import demoMockApi from "./handlers/_demo";
import orgMockApi from "./handlers/_org";
import userMockApi from "./handlers/_user";

const handlers = [...userMockApi, ...orgMockApi, ...demoMockApi];
const worker = setupWorker(...handlers);

export default worker;
