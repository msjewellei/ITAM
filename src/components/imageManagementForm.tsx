import React, { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const schema = z.object({
    acceptedType: z.enum(['image/jpeg', 'image/png', 'image/gif'], {
        required_error: 'Accepted type is required',
    }),
    maxImages: z.number().min(1, { message: 'Must be at least 1' }),
});

const ImageManagementForm: React.FC = () => {
    const [acceptedType, setAcceptedType] = useState<string>('');
    const [maxImages, setMaxImages] = useState<number>(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = schema.safeParse({ acceptedType, maxImages });
        if (!result.success) {
            console.error(result.error.errors);
            return;
        }

        console.log('Accepted Type:', acceptedType);
        console.log('Max Images:', maxImages);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center space-y-2">
                <Label htmlFor="acceptedType" className="mr-4">Accepted Image Type:</Label>
                <Select onValueChange={setAcceptedType}>
                    <SelectTrigger id="acceptedType" className="w-64">
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="image/jpeg">JPEG</SelectItem>
                        <SelectItem value="image/png">PNG</SelectItem>
                        <SelectItem value="image/gif">GIF</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex justify-between items-center space-y-2">
                <Label htmlFor="maxImages" className="mr-4">Max. Number of Images:</Label>
                <Input
                    type="number"
                    id="maxImages"
                    value={maxImages}
                    onChange={(e) => setMaxImages(Number(e.target.value))}
                    min={1}
                    className="w-64"
                />
            </div>

            <div className="flex justify-end">
                <Button type="submit">Submit</Button>
            </div>
        </form>
    );
};

export default ImageManagementForm;