# Generated by Django 5.1.6 on 2025-02-12 15:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0003_alter_post_image_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='image_url',
            field=models.ImageField(blank=True, null=True, upload_to='posts/'),
        ),
    ]
