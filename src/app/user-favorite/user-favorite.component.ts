import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { MovieDescriptionComponent } from '../movie-description/movie-description.component';
import { MovieGenreComponent } from '../movie-genre/movie-genre.component';
import { MovieDirectorComponent } from '../movie-director/movie-director.component';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-favorite',
  templateUrl: './user-favorite.component.html',
  styleUrls: ['./user-favorite.component.scss'],
})
export class UserFavoriteComponent implements OnInit {
  // Store the favorites movies returned by the API call.
  movies: any[] = [];
  // Set user's username.
  username = localStorage.getItem('username');

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getFavoritesMovies();
  }

  // Fetch all movies in user's Favorites list.
  getFavoritesMovies(): void {
    this.fetchApiData.getFavorites(this.username).subscribe((resp: any) => {
      const favoriteMovies = resp.favoriteMovies;

      favoriteMovies.forEach((favoriteMovie: any) => {
        this.fetchApiData.getMovie(favoriteMovie).subscribe((resp: any) => {
          this.movies.push(resp);
        });
        return this.movies;
      });
    });
  }

  // Open dialog to show movie description through MovieDescriptionComponent.
  openDescriptionDialog(Title: string, Description: string): void {
    this.dialog.open(MovieDescriptionComponent, {
      data: { Title, Description },
      width: '400px',
    });
  }

  // Open dialog to show movie genre through MovieGenreComponent.
  openGenreDialog(Title: any, Genre: any): void {
    this.fetchApiData.getGenre(Genre).subscribe((Genre: any) => {
      this.dialog.open(MovieGenreComponent, {
        data: { Title, Genre },
        width: '600px',
      });
    });
  }

  

  // Open dialog to show movie director through MovieDirectorComponent.
  openDirectorDialog(Title: any, Director: any): void {
    this.fetchApiData.getDirector(Director).subscribe((Director: any) => {
      this.dialog.open(MovieDirectorComponent, {
        data: { Title, Director },
        width: '600px',
      });
    });
  }

  // Add or remove movies from the Favorites list.
  toggleFavoriteMovie(movieId: any, Title: any): void {
    this.fetchApiData.getFavorites(this.username).subscribe((resp: any) => {
      const favoriteMovies = resp.favoriteMovies;

      if (favoriteMovies.includes(movieId)) {
        this.fetchApiData
          .removeMovieFavorites(this.username, movieId)
          .subscribe(() => {
            this.snackBar.open(
              `"${Title}" was removed from your Favorites list!`,
              'OK',
              {
                duration: 3000,
              }
            );
          });
      } else {
        this.fetchApiData
          .addMovieFavorites(this.username, movieId)
          .subscribe(() => {
            this.snackBar.open(
              `"${Title}" was added to your Favorites list!`,
              'OK',
              {
                duration: 3000,
              }
            );
          });
      }
    });
  }

  // Add or remove movies from the To-Watch list.
  toggleToWatchMovie(movieId: any, movieTitle: any): void {
    this.fetchApiData.getToWatch(this.username).subscribe((resp: any) => {
      const toWatchMovies = resp.toWatchMovies;

      if (toWatchMovies.includes(movieId)) {
        this.fetchApiData
          .removeMovieToWatch(this.username, movieId)
          .subscribe(() => {
            this.snackBar.open(
              `"${movieTitle}" was removed from your To-Watch list!`,
              'OK',
              {
                duration: 3000,
              }
            );
          });
      } else {
        this.fetchApiData
          .addMovieToWatch(this.username, movieId)
          .subscribe(() => {
            this.snackBar.open(
              `"${movieTitle}" was added to your To-Watch list!`,
              'OK',
              {
                duration: 3000,
              }
            );
          });
      }
    });
  }
}