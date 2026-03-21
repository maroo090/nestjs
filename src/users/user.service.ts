import { forwardRef, Inject } from '@nestjs/common';
import { ReviewService } from 'src/reviews/reviews.service';

/* eslint-disable prettier/prettier */
export class UsersService {
    constructor(@Inject(forwardRef(() => ReviewService))
    private readonly reviewService: ReviewService) { }
    public getAllUsers() {
        return [
            { id: 1, title: 'mohamed', email: "ahmed@gamil" },
            { id: 1, title: 'mohamed', email: "ahmed@gamil" },
            { id: 1, title: 'mohamed', email: "ahmed@gamil" },

        ];
    }
}