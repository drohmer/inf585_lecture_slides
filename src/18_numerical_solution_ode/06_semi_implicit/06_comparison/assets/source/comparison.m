clear;
clf; close all;

p0 = 1;
v0 = 0;

%h = 0.2;
h = 1.9;
K=1;
m=1;
omega=sqrt(K/m);

N=100;

%True solution
p_true = p0;
P_true=[p_true];
A = p0*p0+(v0/omega)^2;
phi=atan2(omega*p0,v0);
for kk=[1:N]
    p_true = A*sin(omega*kk*h+phi);
    P_true=[P_true,p_true];
end

%Verlet
p_verlet=p0;
v_verlet=v0;
P_verlet=[p_verlet];
V_verlet=[v_verlet];
for kk=[1:N]
    v_verlet = v_verlet+h*(-K/m*p_verlet);
    p_verlet = p_verlet + h*v_verlet;
    P_verlet=[P_verlet,p_verlet];
    V_verlet=[V_verlet,v_verlet];
end

%Velocity Verlet
p=p0;
v=v0;
P_vverlet=[p];
V_vverlet=[v];
for kk=[1:N]
    v = v+h/2*(-K/m*p);
    p = p + h*v;
    v = v + h/2 * (-K/m*p);
    P_vverlet = [P_vverlet,p];
    V_vverlet = [V_vverlet,v];
end


%RK4
p=p0;
v=v0;
P_rk4=[p];
V_rk4=[v];
for kk=[1:N]
    k1 = h*[v,-K/m*p];
    k2 = h*([v+k1(2)/2,-K/m*(p+k1(1)/2)]);
    k3 = h*([v+k2(2)/2,-K/m*(p+k2(1)/2)]);
    k4 = h*([v+k3(2),-K/m*(p+k3(1))]);

    p = p + 1/6*(k1(1)+2*k2(1)+2*k3(1)+k4(1));
    v = v + 1/6*(k1(2)+2*k2(2)+2*k3(2)+k4(2));

    P_rk4=[P_rk4,p];
    V_rk4=[V_rk4,v];
end

T=h*[0:N];
V=[1:N+1];

figure(1);
plot(T(V),P_true(V),'r+-','linewidth',4);
hold on
plot(T(V),P_verlet(V),'b+-','linewidth',2);
plot(T(V),P_vverlet(V),'m+-','linewidth',2);
plot(T(V),P_rk4(V),'k+-','linewidth',2);

figure(2);
plot(T(V),1/2*m*V_verlet.^2+K/2*P_verlet.^2,'b+-','linewidth',2);
hold on
plot(T(V),1/2*m*V_rk4.^2+K/2*P_rk4.^2,'k+-','linewidth',2);
plot(T(V),1/2*m*V_vverlet.^2+K/2*P_vverlet.^2,'m+-','linewidth',2);
plot(T(V),ones(size(T(V)))/2,'r-','linewidth',2);
axis([0,T(end),0,1.1]);