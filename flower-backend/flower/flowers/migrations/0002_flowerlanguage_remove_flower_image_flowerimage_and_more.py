# Generated by Django 5.1.6 on 2025-02-23 19:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flowers', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='FlowerLanguage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('language', models.CharField(max_length=255)),
                ('meaning', models.CharField(max_length=255)),
            ],
        ),
        migrations.RemoveField(
            model_name='flower',
            name='image',
        ),
        migrations.CreateModel(
            name='FlowerImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='flower_images/')),
                ('flower', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='flowers.flower')),
            ],
        ),
        migrations.AddField(
            model_name='flower',
            name='flower_languages',
            field=models.ManyToManyField(blank=True, to='flowers.flowerlanguage'),
        ),
    ]
