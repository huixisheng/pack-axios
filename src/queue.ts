import { AxiosRequestConfig } from 'axios';
import Qs from 'qs';

interface queueItem extends AxiosRequestConfig{
  id: string;
  cancelRequest(args: any): void;
}

export default class Queue {
  list: queueItem[] = [];

  constructor() {
    this.list = [];
  }

  static getQueueUniqueId(item: AxiosRequestConfig) {
    let uniqueKey = item.url + '?method=' + item.method;
    let params = item.params;
    // TODO put etc
    // fix:  POST方法是item.data
    if (item.method && item.method.toUpperCase() === 'POST') {
      params = item.data;
    }
    let res = '';
    if (typeof params === 'string') {
      res = params;
    } else {
      res = Qs.stringify(params);
    }
    uniqueKey = uniqueKey + '&' + res;
    return uniqueKey;
  }

  enqueue(item: queueItem) {
    let hasInQueue = false;
    const list = this.list;
    for (let i = list.length - 1; i >= 0; i--) {
      const listItem = list[i];
      /* istanbul ignore else  */
      if (listItem.id === item.id) {
        hasInQueue = true;
        // console.log('hasInQueue', hasInQueue);
        /* istanbul ignore else  */
        if (typeof item.cancelRequest === 'function') {
          item.cancelRequest('requestAbort');
        }
      }
    }
    if (!hasInQueue) {
      list.push(item);
    }
  }

  dequeue(config: AxiosRequestConfig) {
    const uniqueKey = Queue.getQueueUniqueId(config);
    const list = this.list;
    for (let i = list.length - 1; i >= 0; i--) {
      const listItem = list[i];
      /* istanbul ignore else  */
      if (listItem.id === uniqueKey) {
        list.splice(i, 1);
      }
    }
  }

  // clear() {
  //   this.list = [];
  // }
}