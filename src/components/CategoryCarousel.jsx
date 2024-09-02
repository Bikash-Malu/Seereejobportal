
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Card, CardContent } from './ui/card';

const category = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "FullStack Developer"
];

const images = [
  './seeree_java.jpg',
  './seeree_php.jpg',
  './seeree_training.jpg',
  './seeree-devlopment.jpg',
  'https://via.placeholder.com/300x200.png?text=Image+5'
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div>
      {/* Category Carousel */}
 <Carousel className="w-full max-w-xl mx-auto my-20 flex overflow-hidden">
  <CarouselContent className="flex items-center justify-center">
    {category.map((cat, index) => (
      <CarouselItem
        key={index}
        className="flex-shrink-0 w-full sm:w-auto sm:basis-full md:basis-1/2 lg:basis-1/3 flex justify-center"
      >
        <Button onClick={() => searchJobHandler(cat)} variant="outline" className="rounded-full">
          {cat}
        </Button>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>


      {/* Image Carousel */}
      <Carousel className="max-w-xl mx-auto my-10">
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <img src={src} alt={`Carousel Image ${index + 1}`} className="w-full h-full object-fill rounded-md" />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default CategoryCarousel;
