export default interface FetchEvent extends Event {
  request: Request;
  respondWith(response: Promise<Response>): void;
  clientId: string;
}
