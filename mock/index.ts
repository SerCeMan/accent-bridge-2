export type Exercise = {
  id: string;
  text: string;
};

export type Lesson = {
  name: string;
  id: string;
  exercises?: Exercise[];
};

export const lessons: Lesson[] = [
  {
    name: 'Alice In Wonderland',
    id: '5787c712-cd26-4b98-9127-3ce9efab5736',
    exercises: [
      {
        id: '408ee2aa-ad33-4e3e-bb62-5643f0413c17',
        text: 'By this time she had found her way into a tidy little room with a table in the window, and on it a fan and two or three pairs of tiny white kid gloves: she took up the fan and a pair of the gloves, and was just going to leave the room, when her eye fell upon a little bottle that stood near the looking-glass. There was no label this time with the words “drink me,” but nevertheless she uncorked it and put it to her lips. “I know something interesting is sure to happen,” she said to herself, “whenever I eat or drink anything; so I’ll just see what this bottle does. I do hope it’ll make me grow large again, for really I’m quite tired of being such a tiny little thing!',
      },
      {
        id: '80e7c308-a03d-454b-b592-8f72fc74dc4e',
        text: 'So she swallowed one of the cakes, and was delighted to find that she began shrinking directly. As soon as she was small enough to get through the door, she ran out of the house, and found quite a crowd of little animals and birds waiting outside. The poor little Lizard, Bill, was in the middle, being held up by two guinea-pigs, who were giving it something out of a bottle. They all made a rush at Alice the moment she appeared; but she ran off as hard as she could, and soon found herself safe in a thick wood.',
      },
      {
        id: 'a1ba6a0b-6382-45bc-83b2-30a33a4894aa',
        text: 'Alas! it was too late to wish that! She went on growing, and growing, and very soon had to kneel down on the floor: in another minute there was not even room for this, and she tried the effect of lying down with one elbow against the door, and the other arm curled round her head. Still she went on growing, and, as a last resource, she put one arm out of the window, and one foot up the chimney, and said to herself “Now I can do no more, whatever happens. What will become of me?',
      },
      {
        id: 'e389d1e0-8219-4aaa-828b-2ce917f96189',
        text: 'As there seemed to be no chance of getting her hands up to her head, she tried to get her head down to them, and was delighted to find that her neck would bend about easily in any direction, like a serpent. She had just succeeded in curving it down into a graceful zigzag, and was going to dive in among the leaves, which she found to be nothing but the tops of the trees under which she had been wandering, when a sharp hiss made her draw back in a hurry: a large pigeon had flown into her face, and was beating her violently with its wings.'
      },
    ],
  },
  {
    name: 'The Great Gatsby',
    id: 'a79c135b-fbe4-45eb-a66a-6700fd8d8836',
    exercises: [
      {
        id: '922f1a6e-9137-415d-ac01-4a5445dc2aca',
        text: 'text'
      },
      {
        id: 'e02fb7a5-0b5d-4876-9f57-9b4b23f9668d',
        text: 'text'
      },
      {
        id: '175ffadd-93e2-414a-88f3-dac4c28711a1',
        text: 'text'
      },
      {
        id: '60b4ac9d-862e-49af-8ed2-733d558ca366',
        text: 'text'
      },
    ],
  },
];