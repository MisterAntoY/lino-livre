import { Hono } from 'hono';
import { Bindings } from '../types';
import { edgeLoadBalancer } from '../loadBalancer';

export const loadbalancerRouter = new Hono<{ Bindings: Bindings }>();

loadbalancerRouter.get('/api/loadbalancer/status', (c) => {
  c.header('Cache-Control', 'no-store');
  return c.json(edgeLoadBalancer.getSnapshot());
});
