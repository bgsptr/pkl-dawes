import { MonevRepository } from "../internal/repositories/MonevRepository";

export class DIContainer {
    private static _monevRepository = new MonevRepository();

    static getMonevRepository() {
        return this._monevRepository;
    }

    static () {
        // return new 
    }
}