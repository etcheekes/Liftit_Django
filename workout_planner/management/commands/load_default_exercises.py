import csv
from django.core.management import BaseCommand
from workout_planner.models import Default_exercises

class Command(BaseCommand):
    help = 'Import default exercises from a CSV file'

    # set up arguments to use in command line
    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str)

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']

        # open file to read
        with open(csv_file, 'r') as f:
            # save file to variable
            reader = csv.reader(f)
            # Skip the header row in csv file
            header = next(reader) 
            
            # for each row in file, place each column value into the correct field in Default_exercises model
            for row in reader:
                Default_exercises.objects.create(
                    # primary key field populated automatically by django
                    default_exercise=row[0],
                    default_muscle=row[1],
                    default_equipment=row[2],
                )

# run command: python manage.py load_default_exercises file_path.csv
