create database project;
use project;

create table Bus(
bus_id int not null,
survice_provider varchar(50),
is_ac char,
rating float
);
ALTER TABLE Bus  add primary key (Bus_id);

create table BusDepartureTime(
bus_id int not null,
source varchar(20),
deoparture_date varchar(10),
time_of_departure varchar(10),
foreign key (bus_id) references Bus(Bus_id));
alter table BusDepartureTime add primary key (deoparture_date);

create table BusJourneyHour(
bus_id int,
source varchar(20),
destination varchar(20),
deoparture_date varchar(10),
journey_hours int,
foreign key (bus_id) references Bus(Bus_id),
foreign key (deoparture_date) references BusDepartureTime(deoparture_date));

create table BusReservation(
bus_id int,
source varchar(20),
deoparture_date varchar(10),
seat_type varchar(10),
cost int,
total_availabe_seats int,
foreign key (deoparture_date) references BusDepartureTime(deoparture_date),
foreign key (bus_id) references BusDepartureTime(bus_id));


