/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class ReviewService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService
    ) { }
    public getAllReviews() {
        return [
            { id: 1, rating: 'good', comment: 'nice food' },
            { id: 2, rating: 'bad ', comment: 'very bad one' },
            { id: 3, rating: 'very good', comment: 'very delicious' },
            this.usersService.getAllUsers()
        ];
    }
}
