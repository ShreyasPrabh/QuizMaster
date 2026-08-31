from django.core.management.base import BaseCommand
from quiz.models import Choice, Question, SubTopic, Topic


class Command(BaseCommand):
    help = 'Seed the quiz app with rich topics, subtopics, and practice questions.'

    def handle(self, *args, **options):
        topic_defs = [
            {
                'name': 'Programming',
                'icon': 'Code',
                'description': 'Master programming languages, algorithms, and web tech.',
                'color': 'from-indigo-500 to-purple-600',
                'subtopics': [
                    {
                        'name': 'Python Fundamentals',
                        'description': 'Python syntax, built-in functions, data structures, and OOP.',
                        'questions': [
                            {
                                'text': 'What is the output of len("hello world")?',
                                'difficulty': 'easy',
                                'explanation': 'The len() function returns the total number of characters, including spaces (11 characters).',
                                'code_snippet': 's = "hello world"\nprint(len(s))',
                                'choices': [
                                    {'text': '10', 'is_correct': False},
                                    {'text': '11', 'is_correct': True},
                                    {'text': '12', 'is_correct': False},
                                    {'text': '5', 'is_correct': False},
                                ],
                            },
                            {
                                'text': 'Which keyword is used to define a function in Python?',
                                'difficulty': 'easy',
                                'explanation': 'In Python, functions are defined using the "def" keyword.',
                                'code_snippet': 'def greet(name):\n    return f"Hello, {name}!"',
                                'choices': [
                                    {'text': 'func', 'is_correct': False},
                                    {'text': 'function', 'is_correct': False},
                                    {'text': 'def', 'is_correct': True},
                                    {'text': 'define', 'is_correct': False},
                                ],
                            },
                            {
                                'text': 'What data type is the result of: type([1, 2, 3])?',
                                'difficulty': 'easy',
                                'explanation': 'Square brackets define a Python list.',
                                'code_snippet': None,
                                'choices': [
                                    {'text': '<class "tuple">', 'is_correct': False},
                                    {'text': '<class "list">', 'is_correct': True},
                                    {'text': '<class "set">', 'is_correct': False},
                                    {'text': '<class "array">', 'is_correct': False},
                                ],
                            },
                            {
                                'text': 'What will be the output of print(2 ** 3)?',
                                'difficulty': 'intermediate',
                                'explanation': '** is the exponentiation operator in Python. 2 raised to power 3 is 8.',
                                'code_snippet': 'print(2 ** 3)',
                                'choices': [
                                    {'text': '6', 'is_correct': False},
                                    {'text': '8', 'is_correct': True},
                                    {'text': '9', 'is_correct': False},
                                    {'text': '16', 'is_correct': False},
                                ],
                            },
                            {
                                'text': 'Which method is used to remove whitespace from both ends of a string?',
                                'difficulty': 'intermediate',
                                'explanation': 'strip() removes leading and trailing whitespaces.',
                                'code_snippet': '"  hello  ".strip()',
                                'choices': [
                                    {'text': 'trim()', 'is_correct': False},
                                    {'text': 'strip()', 'is_correct': True},
                                    {'text': 'clean()', 'is_correct': False},
                                    {'text': 'cut()', 'is_correct': False},
                                ],
                            },
                        ],
                    },
                    {
                        'name': 'JavaScript & Web',
                        'description': 'Modern JS (ES6+), async/await, closures, and DOM.',
                        'questions': [
                            {
                                'text': 'Which keyword declares a block-scoped variable that can be reassigned?',
                                'difficulty': 'easy',
                                'explanation': 'let is block-scoped and reassignable, whereas const cannot be reassigned.',
                                'code_snippet': 'let count = 1;\ncount = 2;',
                                'choices': [
                                    {'text': 'var', 'is_correct': False},
                                    {'text': 'let', 'is_correct': True},
                                    {'text': 'const', 'is_correct': False},
                                    {'text': 'static', 'is_correct': False},
                                ],
                            },
                            {
                                'text': 'What does typeof null return in JavaScript?',
                                'difficulty': 'intermediate',
                                'explanation': 'In JavaScript, typeof null returns "object" due to a legacy design quirk in the original implementation.',
                                'code_snippet': 'console.log(typeof null);',
                                'choices': [
                                    {'text': '"null"', 'is_correct': False},
                                    {'text': '"undefined"', 'is_correct': False},
                                    {'text': '"object"', 'is_correct': True},
                                    {'text': '"number"', 'is_correct': False},
                                ],
                            },
                            {
                                'text': 'Which array method creates a new array with transformed elements?',
                                'difficulty': 'easy',
                                'explanation': 'The map() method calls a provided function on every element in the calling array.',
                                'code_snippet': '[1, 2, 3].map(x => x * 2)',
                                'choices': [
                                    {'text': 'forEach()', 'is_correct': False},
                                    {'text': 'map()', 'is_correct': True},
                                    {'text': 'filter()', 'is_correct': False},
                                    {'text': 'reduce()', 'is_correct': False},
                                ],
                            },
                            {
                                'text': 'What will Promise.resolve(5).then(x => x * 2) resolve to?',
                                'difficulty': 'intermediate',
                                'explanation': 'The promise resolves with 5, then the handler multiplies it by 2 to yield 10.',
                                'code_snippet': None,
                                'choices': [
                                    {'text': '5', 'is_correct': False},
                                    {'text': '10', 'is_correct': True},
                                    {'text': 'undefined', 'is_correct': False},
                                    {'text': 'Promise<pending>', 'is_correct': False},
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                'name': 'Mathematics',
                'icon': 'Calculator',
                'description': 'Sharpen your algebra, geometry, and mental math skills.',
                'color': 'from-blue-500 to-cyan-500',
                'subtopics': [
                    {
                        'name': 'Algebra & Equations',
                        'description': 'Linear equations, polynomials, and variables.',
                        'questions': [
                            {
                                'text': 'Solve for x: 3x + 9 = 24',
                                'difficulty': 'easy',
                                'explanation': '3x = 24 - 9 = 15 => x = 15 / 3 = 5.',
                                'code_snippet': None,
                                'choices': [
                                    {'text': '3', 'is_correct': False},
                                    {'text': '4', 'is_correct': False},
                                    {'text': '5', 'is_correct': True},
                                    {'text': '6', 'is_correct': False},
                                ],
                            },
                            {
                                'text': 'What is the value of 5! (5 factorial)?',
                                'difficulty': 'easy',
                                'explanation': '5! = 5 * 4 * 3 * 2 * 1 = 120.',
                                'code_snippet': None,
                                'choices': [
                                    {'text': '60', 'is_correct': False},
                                    {'text': '100', 'is_correct': False},
                                    {'text': '120', 'is_correct': True},
                                    {'text': '125', 'is_correct': False},
                                ],
                            },
                            {
                                'text': 'If a right triangle has legs of 3 and 4, what is the hypotenuse?',
                                'difficulty': 'intermediate',
                                'explanation': 'By Pythagorean theorem: sqrt(3^2 + 4^2) = sqrt(9 + 16) = sqrt(25) = 5.',
                                'code_snippet': None,
                                'choices': [
                                    {'text': '5', 'is_correct': True},
                                    {'text': '6', 'is_correct': False},
                                    {'text': '7', 'is_correct': False},
                                    {'text': '8', 'is_correct': False},
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                'name': 'Science & Tech',
                'icon': 'Zap',
                'description': 'Physics, computing trivia, and scientific principles.',
                'color': 'from-emerald-500 to-teal-600',
                'subtopics': [
                    {
                        'name': 'Computer Science & AI',
                        'description': 'Data structures, algorithms, and artificial intelligence basics.',
                        'questions': [
                            {
                                'text': 'What is the time complexity of binary search on a sorted array of size n?',
                                'difficulty': 'intermediate',
                                'explanation': 'Binary search divides the search interval in half every step, giving O(log n).',
                                'code_snippet': None,
                                'choices': [
                                    {'text': 'O(1)', 'is_correct': False},
                                    {'text': 'O(n)', 'is_correct': False},
                                    {'text': 'O(log n)', 'is_correct': True},
                                    {'text': 'O(n log n)', 'is_correct': False},
                                ],
                            },
                            {
                                'text': 'Which data structure follows the First-In, First-Out (FIFO) principle?',
                                'difficulty': 'easy',
                                'explanation': 'A Queue follows FIFO, while a Stack follows LIFO (Last-In, First-Out).',
                                'code_snippet': None,
                                'choices': [
                                    {'text': 'Stack', 'is_correct': False},
                                    {'text': 'Queue', 'is_correct': True},
                                    {'text': 'Binary Tree', 'is_correct': False},
                                    {'text': 'Heap', 'is_correct': False},
                                ],
                            },
                        ],
                    },
                ],
            },
        ]

        for topic_data in topic_defs:
            topic, _ = Topic.objects.get_or_create(
                name=topic_data['name'],
                defaults={
                    'icon': topic_data.get('icon', 'BookOpen'),
                    'description': topic_data.get('description', ''),
                    'color': topic_data.get('color', 'from-blue-500 to-indigo-600'),
                },
            )

            for subtopic_data in topic_data['subtopics']:
                subtopic, _ = SubTopic.objects.get_or_create(
                    topic=topic,
                    name=subtopic_data['name'],
                    defaults={'description': subtopic_data.get('description', '')},
                )

                for question_data in subtopic_data['questions']:
                    question, _ = Question.objects.get_or_create(
                        subtopic=subtopic,
                        text=question_data['text'],
                        defaults={
                            'difficulty': question_data['difficulty'],
                            'explanation': question_data['explanation'],
                            'code_snippet': question_data.get('code_snippet'),
                        },
                    )
                    for choice_data in question_data['choices']:
                        Choice.objects.get_or_create(
                            question=question,
                            text=choice_data['text'],
                            defaults={'is_correct': choice_data['is_correct']},
                        )

        self.stdout.write(self.style.SUCCESS('Quiz seed data created successfully.'))
