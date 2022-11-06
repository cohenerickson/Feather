export default interface FetchEvent extends Event {
  request: Request;
  respondWith(response: Response): void;
}
